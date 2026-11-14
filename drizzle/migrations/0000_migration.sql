-- ========== PROFILES ==========
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ========== HOUSEHOLDS ==========
CREATE TABLE public.households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 80),
  join_code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.households TO authenticated;
GRANT ALL ON public.households TO service_role;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

-- ========== MEMBERSHIPS ==========
CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'morador' CHECK (role IN ('admin','morador')),
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','inativo')),
  created_at timestamptz NOT NULL DEFAULT now()
);
-- one active household per user
CREATE UNIQUE INDEX memberships_one_active_per_user ON public.memberships(user_id) WHERE status = 'ativo';
CREATE INDEX memberships_household_idx ON public.memberships(household_id);
GRANT SELECT ON public.memberships TO authenticated;
GRANT ALL ON public.memberships TO service_role;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- ========== TASKS ==========
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid NOT NULL REFERENCES public.households(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 120),
  description text CHECK (description IS NULL OR char_length(description) <= 1000),
  responsible_user_id uuid NOT NULL REFERENCES public.profiles(id),
  due_date date NOT NULL,
  effort_level text NOT NULL CHECK (effort_level IN ('baixo','medio','alto')),
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','concluida')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX tasks_household_idx ON public.tasks(household_id);
GRANT SELECT, INSERT, UPDATE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- ========== HELPER FUNCTIONS (security definer avoids RLS recursion) ==========
CREATE OR REPLACE FUNCTION public.is_household_member(_household_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE household_id = _household_id AND user_id = _user_id AND status = 'ativo'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_household_admin(_household_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE household_id = _household_id AND user_id = _user_id AND status = 'ativo' AND role = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.shares_household(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships m1
    JOIN public.memberships m2 ON m1.household_id = m2.household_id
    WHERE m1.user_id = _a AND m2.user_id = _b AND m1.status = 'ativo' AND m2.status = 'ativo'
  )
$$;

-- ========== RLS POLICIES ==========
CREATE POLICY "Ver o próprio perfil e de colegas de casa" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.shares_household(auth.uid(), id));
CREATE POLICY "Atualizar o próprio perfil" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Membros veem sua residência" ON public.households
  FOR SELECT TO authenticated
  USING (public.is_household_member(id, auth.uid()));
CREATE POLICY "Admin atualiza sua residência" ON public.households
  FOR UPDATE TO authenticated
  USING (public.is_household_admin(id, auth.uid()))
  WITH CHECK (public.is_household_admin(id, auth.uid()));

CREATE POLICY "Membros veem os vínculos da residência" ON public.memberships
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_household_member(household_id, auth.uid()));

CREATE POLICY "Membros veem as tarefas da residência" ON public.tasks
  FOR SELECT TO authenticated
  USING (public.is_household_member(household_id, auth.uid()));
CREATE POLICY "Admin cadastra tarefas" ON public.tasks
  FOR INSERT TO authenticated
  WITH CHECK (public.is_household_admin(household_id, auth.uid()));
CREATE POLICY "Membros podem tentar atualizar (regras no gatilho)" ON public.tasks
  FOR UPDATE TO authenticated
  USING (public.is_household_member(household_id, auth.uid()))
  WITH CHECK (public.is_household_member(household_id, auth.uid()));

-- ========== TASK RULES TRIGGER ==========
CREATE OR REPLACE FUNCTION public.enforce_task_rules()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  -- service role / maintenance bypass
  IF _uid IS NULL THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_household_admin(NEW.household_id, _uid) THEN
      RAISE EXCEPTION 'Somente o administrador pode cadastrar tarefas.';
    END IF;
    IF NOT public.is_household_member(NEW.household_id, NEW.responsible_user_id) THEN
      RAISE EXCEPTION 'O responsável precisa ser morador desta residência.';
    END IF;
    NEW.status := 'pendente';
    NEW.completed_at := NULL;
    NEW.created_at := now();
    RETURN NEW;
  END IF;

  -- UPDATE
  IF OLD.status = 'concluida' THEN
    RAISE EXCEPTION 'Tarefas concluídas não podem ser alteradas.';
  END IF;
  IF NEW.household_id <> OLD.household_id OR NEW.created_at <> OLD.created_at THEN
    RAISE EXCEPTION 'Alteração não permitida.';
  END IF;

  IF NEW.status = 'concluida' THEN
    -- completion: only the responsible person, nothing else may change
    IF _uid <> OLD.responsible_user_id THEN
      RAISE EXCEPTION 'Somente o responsável pode concluir esta tarefa.';
    END IF;
    IF NEW.title IS DISTINCT FROM OLD.title
       OR NEW.description IS DISTINCT FROM OLD.description
       OR NEW.responsible_user_id IS DISTINCT FROM OLD.responsible_user_id
       OR NEW.due_date IS DISTINCT FROM OLD.due_date
       OR NEW.effort_level IS DISTINCT FROM OLD.effort_level THEN
      RAISE EXCEPTION 'Ao concluir, não é possível alterar outros dados da tarefa.';
    END IF;
    NEW.completed_at := now();
    RETURN NEW;
  END IF;

  -- edit of a pending task: admin only
  IF NOT public.is_household_admin(OLD.household_id, _uid) THEN
    RAISE EXCEPTION 'Somente o administrador pode editar tarefas.';
  END IF;
  IF NOT public.is_household_member(OLD.household_id, NEW.responsible_user_id) THEN
    RAISE EXCEPTION 'O responsável precisa ser morador desta residência.';
  END IF;
  NEW.completed_at := NULL;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tasks_enforce_rules
  BEFORE INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.enforce_task_rules();

-- ========== PROFILE ON SIGNUP ==========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''), split_part(NEW.email, '@', 1)),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== HOUSEHOLD ACTIONS ==========
CREATE OR REPLACE FUNCTION public.create_household(_name text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _hid uuid;
  _code text;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Faça login para continuar.';
  END IF;
  IF _name IS NULL OR char_length(trim(_name)) = 0 THEN
    RAISE EXCEPTION 'Informe o nome da residência.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.memberships WHERE user_id = _uid AND status = 'ativo') THEN
    RAISE EXCEPTION 'Você já participa de uma residência.';
  END IF;

  LOOP
    _code := upper(substr(translate(encode(gen_random_bytes(8), 'base64'), '+/=0O1Il', ''), 1, 6));
    EXIT WHEN char_length(_code) = 6
      AND NOT EXISTS (SELECT 1 FROM public.households WHERE join_code = _code);
  END LOOP;

  INSERT INTO public.households (name, join_code) VALUES (trim(_name), _code) RETURNING id INTO _hid;
  INSERT INTO public.memberships (household_id, user_id, role, status) VALUES (_hid, _uid, 'admin', 'ativo');
  RETURN _hid;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_household(_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _hid uuid;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Faça login para continuar.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.memberships WHERE user_id = _uid AND status = 'ativo') THEN
    RAISE EXCEPTION 'Você já participa de uma residência.';
  END IF;
  SELECT id INTO _hid FROM public.households WHERE join_code = upper(trim(_code));
  IF _hid IS NULL THEN
    RAISE EXCEPTION 'Código não encontrado. Confira e tente novamente.';
  END IF;
  INSERT INTO public.memberships (household_id, user_id, role, status) VALUES (_hid, _uid, 'morador', 'ativo');
  RETURN _hid;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_household(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.join_household(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_household(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_household(text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

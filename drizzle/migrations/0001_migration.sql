CREATE OR REPLACE FUNCTION public.create_household(_name text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _hid uuid;
  _code text;
  _chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
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
    SELECT string_agg(substr(_chars, 1 + floor(random() * length(_chars))::int, 1), '')
      INTO _code FROM generate_series(1, 6);
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.households WHERE join_code = _code);
  END LOOP;

  INSERT INTO public.households (name, join_code) VALUES (trim(_name), _code) RETURNING id INTO _hid;
  INSERT INTO public.memberships (household_id, user_id, role, status) VALUES (_hid, _uid, 'admin', 'ativo');
  RETURN _hid;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.create_household(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_household(text) TO authenticated;

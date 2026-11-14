import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/morajunto/Logo";
import { supabase } from "@/integrations/supabase/client";

type Search = { modo?: "cadastro" | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search =>
    search["modo"] === "cadastro" ? { modo: "cadastro" } : {},
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — MoraJunto" },
      {
        name: "description",
        content: "Acesse o MoraJunto para organizar as tarefas da sua casa compartilhada.",
      },
      { property: "og:title", content: "Entrar ou criar conta — MoraJunto" },
      {
        property: "og:description",
        content: "Acesse o MoraJunto e organize as tarefas da sua casa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function translateAuthError(message: string) {
  if (/invalid login credentials/i.test(message)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(message))
    return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  if (/already registered|already been registered/i.test(message))
    return "Este e-mail já tem uma conta. Tente entrar.";
  if (/email address is not allowed|invalid email|is invalid/i.test(message))
    return "Este e-mail não é aceito. Use um endereço de e-mail real.";
  if (/rate limit/i.test(message)) return "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.";
  if (/password/i.test(message) && /least/i.test(message))
    return "A senha precisa ter pelo menos 6 caracteres.";
  return message;
}

function AuthPage() {
  const { modo } = Route.useSearch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>(modo === "cadastro" ? "cadastro" : "entrar");
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/painel", replace: true });
    });
  }, [navigate]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });
    setLoading(false);
    if (error) {
      toast.error(translateAuthError(error.message));
      return;
    }
    navigate({ to: "/painel", replace: true });
  }

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    if (!name) {
      toast.error("Informe seu nome.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast.error(translateAuthError(error.message));
      return;
    }
    if (data.session) {
      navigate({ to: "/residencia", replace: true });
    } else {
      setConfirmEmail(email);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center paper-texture px-4 py-10">
      <Link to="/" className="mb-8" aria-label="Voltar ao início">
        <Logo size="lg" />
      </Link>
      <div className="surface-card w-full max-w-md p-6 md:p-8">
        {confirmEmail ? (
          <div className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
            <h1 className="mt-4 text-2xl font-semibold">Confira seu e-mail</h1>
            <p className="mt-2 text-muted-foreground">
              Enviamos um link de confirmação para{" "}
              <strong className="text-foreground">{confirmEmail}</strong>. Depois de confirmar, é só
              entrar.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setConfirmEmail(null);
                setTab("entrar");
              }}
            >
              Voltar para entrar
            </Button>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entrar">Entrar</TabsTrigger>
              <TabsTrigger value="cadastro">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="entrar">
              <form method="post" onSubmit={handleLogin} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input id="login-email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="cadastro">
              <form method="post" onSubmit={handleSignup} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome</Label>
                  <Input id="signup-name" name="name" autoComplete="name" maxLength={60} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres.</p>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

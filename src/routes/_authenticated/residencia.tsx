import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { DoorOpen, HousePlus, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/morajunto/Logo";
import { LoadingState } from "@/components/morajunto/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useHousehold } from "@/lib/household";
import { signOut } from "@/lib/sign-out";

export const Route = createFileRoute("/_authenticated/residencia")({
  head: () => ({
    meta: [
      { title: "Sua residência — MoraJunto" },
      {
        name: "description",
        content: "Crie uma residência ou entre em uma com o código de acesso.",
      },
      { property: "og:title", content: "Sua residência — MoraJunto" },
      {
        property: "og:description",
        content: "Crie uma residência ou entre com o código de acesso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResidenciaPage,
});

function ResidenciaPage() {
  const { data, isLoading } = useHousehold();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<"create" | "join" | null>(null);

  if (isLoading) return <LoadingState />;
  if (data?.household) return <Navigate to="/painel" replace />;

  async function done() {
    await queryClient.invalidateQueries({ queryKey: ["household"] });
    navigate({ to: "/painel", replace: true });
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name")).trim();
    if (!name) {
      toast.error("Dê um nome para a residência.");
      return;
    }
    setBusy("create");
    const { error } = await supabase.rpc("create_household", { _name: name });
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Residência criada! Compartilhe o código com seus colegas.");
    await done();
  }

  async function handleJoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code")).trim();
    if (!code) {
      toast.error("Informe o código de acesso.");
      return;
    }
    setBusy("join");
    const { error } = await supabase.rpc("join_household", { _code: code });
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Você entrou na residência!");
    await done();
  }

  return (
    <div className="min-h-screen paper-texture px-4 py-8">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Logo />
        <Button
          variant="ghost"
          onClick={async () => {
            await signOut(queryClient);
            navigate({ to: "/auth", replace: true });
          }}
        >
          <LogOut /> Sair
        </Button>
      </div>

      <div className="mx-auto mt-10 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold md:text-4xl">Olá, {data?.userName}!</h1>
        <p className="mt-2 text-muted-foreground">
          Para começar, crie a residência da sua casa ou entre em uma que já existe.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
        <form onSubmit={handleCreate} className="surface-card flex flex-col p-6">
          <HousePlus className="h-8 w-8 text-primary" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-semibold">Criar residência</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Você será o administrador e poderá cadastrar e distribuir as tarefas.
          </p>
          <div className="mt-5 space-y-2">
            <Label htmlFor="name">Nome da residência</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex.: República Girassol"
              maxLength={80}
              required
            />
          </div>
          <Button type="submit" className="mt-5" disabled={busy !== null}>
            {busy === "create" ? "Criando..." : "Criar residência"}
          </Button>
        </form>

        <form onSubmit={handleJoin} className="surface-card flex flex-col p-6">
          <DoorOpen className="h-8 w-8 text-terracotta" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-semibold">Entrar com código</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Peça o código de acesso para quem criou a residência.
          </p>
          <div className="mt-5 space-y-2">
            <Label htmlFor="code">Código de acesso</Label>
            <Input
              id="code"
              name="code"
              placeholder="Ex.: K7M2QX"
              maxLength={12}
              autoCapitalize="characters"
              className="uppercase tracking-widest"
              required
            />
          </div>
          <Button type="submit" variant="terracotta" className="mt-5" disabled={busy !== null}>
            {busy === "join" ? "Entrando..." : "Entrar na residência"}
          </Button>
        </form>
      </div>
    </div>
  );
}

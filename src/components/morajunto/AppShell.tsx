import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { BarChart3, ClipboardList, LayoutDashboard, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/morajunto/Logo";
import { useHousehold, type HouseholdContext } from "@/lib/household";
import { signOut } from "@/lib/sign-out";

export type ReadyHousehold = HouseholdContext & {
  household: NonNullable<HouseholdContext["household"]>;
};

const NAV = [
  { to: "/painel", label: "Painel", icon: LayoutDashboard },
  { to: "/tarefas", label: "Tarefas", icon: ClipboardList },
  { to: "/moradores", label: "Moradores", icon: Users },
  { to: "/equilibrio", label: "Equilíbrio", icon: BarChart3 },
] as const;

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center text-muted-foreground"
      role="status"
    >
      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {label}
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: (ctx: ReadyHousehold) => ReactNode;
  children: (ctx: ReadyHousehold) => ReactNode;
}) {
  const { data, isLoading, error } = useHousehold();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut(queryClient);
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) return <LoadingState />;
  if (error) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <p className="text-destructive">Não foi possível carregar seus dados.</p>
        <Button className="mt-4" onClick={handleSignOut}>
          Entrar novamente
        </Button>
      </div>
    );
  }
  if (!data?.household) return <Navigate to="/residencia" replace />;
  const ctx = data as ReadyHousehold;

  return (
    <div className="min-h-screen paper-texture pb-24 md:pb-10">
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/painel" aria-label="Ir para o painel">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden text-right text-xs leading-tight sm:block">
              <div className="font-semibold text-foreground">{ctx.userName}</div>
              <div className="text-muted-foreground">
                {ctx.household.name} · {ctx.isAdmin ? "Administrador" : "Morador"}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sair">
              <LogOut />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
            {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
          </div>
          {actions?.(ctx)}
        </div>
        {children(ctx)}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t bg-card/95 backdrop-blur md:hidden"
        aria-label="Navegação principal"
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground data-[status=active]:text-primary"
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

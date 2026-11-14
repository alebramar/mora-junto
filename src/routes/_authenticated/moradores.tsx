import { createFileRoute } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppShell, type ReadyHousehold } from "@/components/morajunto/AppShell";
import { JoinCode } from "@/components/morajunto/JoinCode";
import { initials, useTasks } from "@/lib/household";
import { pointsByMember } from "@/lib/tasks-rules";

export const Route = createFileRoute("/_authenticated/moradores")({
  head: () => ({
    meta: [
      { title: "Moradores — MoraJunto" },
      {
        name: "description",
        content: "Quem mora na residência, quem é o administrador e os pontos de cada um.",
      },
      { property: "og:title", content: "Moradores — MoraJunto" },
      { property: "og:description", content: "Moradores da residência e seus papéis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MoradoresPage,
});

function MoradoresPage() {
  return (
    <AppShell title="Moradores" subtitle="Quem divide a casa com você">
      {(ctx) => <MoradoresContent ctx={ctx} />}
    </AppShell>
  );
}

function MoradoresContent({ ctx }: { ctx: ReadyHousehold }) {
  const { data: tasks } = useTasks(ctx.household.id);
  const points = pointsByMember(
    tasks ?? [],
    ctx.members.map((m) => m.id),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
        {ctx.members.map((m) => (
          <li key={m.id} className="surface-card flex items-center gap-4 p-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold ${m.role === "admin" ? "bg-terracotta text-terracotta-foreground" : "bg-primary-soft text-primary"}`}
              aria-hidden="true"
            >
              {initials(m.name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{m.name}</span>
                {m.id === ctx.userId && (
                  <span className="text-xs text-muted-foreground">(você)</span>
                )}
              </div>
              <div className="truncate text-sm text-muted-foreground">{m.email}</div>
              <div className="mt-1.5 flex items-center gap-2">
                {m.role === "admin" ? (
                  <Badge variant="soft">
                    <Crown className="mr-1 h-3 w-3" aria-hidden="true" /> Administrador
                  </Badge>
                ) : (
                  <Badge variant="pending">Morador</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {points[m.id] ?? 0} {(points[m.id] ?? 0) === 1 ? "ponto" : "pontos"}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="surface-card h-fit space-y-3 p-5">
        <h2 className="text-xl font-semibold">{ctx.household.name}</h2>
        <p className="text-sm text-muted-foreground">
          {ctx.members.length} {ctx.members.length === 1 ? "morador" : "moradores"}. Para alguém
          entrar, compartilhe o código:
        </p>
        <JoinCode code={ctx.household.join_code} />
      </aside>
    </div>
  );
}

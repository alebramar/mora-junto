import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Scale } from "lucide-react";
import { AppShell, LoadingState, type ReadyHousehold } from "@/components/morajunto/AppShell";
import { useTasks } from "@/lib/household";
import { pointsByMember } from "@/lib/tasks-rules";

export const Route = createFileRoute("/_authenticated/equilibrio")({
  head: () => ({
    meta: [
      { title: "Equilíbrio — MoraJunto" },
      {
        name: "description",
        content: "Veja a participação de cada morador nas tarefas concluídas da casa.",
      },
      { property: "og:title", content: "Equilíbrio — MoraJunto" },
      { property: "og:description", content: "Participação de cada morador nas tarefas da casa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EquilibrioPage,
});

function EquilibrioPage() {
  return (
    <AppShell title="Equilíbrio" subtitle="A divisão das tarefas está justa?">
      {(ctx) => <EquilibrioContent ctx={ctx} />}
    </AppShell>
  );
}

function EquilibrioContent({ ctx }: { ctx: ReadyHousehold }) {
  const { data: tasks, isLoading } = useTasks(ctx.household.id);
  if (isLoading || !tasks) return <LoadingState />;

  const points = pointsByMember(
    tasks,
    ctx.members.map((m) => m.id),
  );
  const total = Object.values(points).reduce((a, b) => a + b, 0);
  const average = ctx.members.length ? total / ctx.members.length : 0;
  // Ordem de entrada na residência — de propósito, sem ordenar por pontos (não é ranking).
  const data = ctx.members.map((m) => ({
    name: m.name.split(" ")[0],
    fullName: m.name,
    pontos: points[m.id] ?? 0,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section
        className="surface-card p-5 lg:col-span-2"
        aria-label="Gráfico de pontos por morador"
      >
        <h2 className="text-xl font-semibold">Pontos por morador</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          A linha tracejada mostra a média da casa (
          {average.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} pts).
        </p>
        {total === 0 ? (
          <div className="flex h-64 items-center justify-center text-center text-muted-foreground">
            Ainda não há tarefas concluídas. Os pontos aparecem aqui assim que alguém concluir uma
            tarefa.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  formatter={(v: number) => [`${v} ${v === 1 ? "ponto" : "pontos"}`, "Pontos"]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <ReferenceLine y={average} stroke="var(--color-terracotta)" strokeDasharray="6 4" />
                <Bar
                  dataKey="pontos"
                  fill="var(--color-primary)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={64}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <aside className="space-y-4">
        <div className="surface-card p-5">
          <Scale className="h-7 w-7 text-terracotta" aria-hidden="true" />
          <h2 className="mt-2 text-lg font-semibold">Como funciona</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li>• Só tarefas concluídas geram pontos.</li>
            <li>• Baixo = 1 ponto, Médio = 2, Alto = 3.</li>
            <li>• Não é uma competição: o objetivo é todo mundo ficar perto da média.</li>
          </ul>
        </div>
        <div className="surface-card p-5">
          <h2 className="text-lg font-semibold">Participação</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {ctx.members.map((m) => {
              const p = points[m.id] ?? 0;
              const share = total ? Math.round((p / total) * 100) : 0;
              return (
                <li key={m.id} className="flex justify-between gap-2">
                  <span>{m.name}</span>
                  <span className="text-muted-foreground">
                    {p} pts · {share}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}

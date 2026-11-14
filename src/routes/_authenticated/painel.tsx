import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, LoadingState, type ReadyHousehold } from "@/components/morajunto/AppShell";
import { TaskCard } from "@/components/morajunto/TaskCard";
import { PointsBars } from "@/components/morajunto/PointsBars";
import { JoinCode } from "@/components/morajunto/JoinCode";
import { useTasks } from "@/lib/household";
import { isOverdue, pointsByMember, taskCounts, todayInBrazil } from "@/lib/tasks-rules";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel — MoraJunto" },
      {
        name: "description",
        content: "Resumo das tarefas da casa: pendentes, atrasadas, concluídas e pontos.",
      },
      { property: "og:title", content: "Painel — MoraJunto" },
      { property: "og:description", content: "Resumo das tarefas da sua casa compartilhada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PainelPage,
});

function PainelPage() {
  return (
    <AppShell
      title="Painel"
      subtitle="Como estão as tarefas da casa hoje"
      actions={(ctx) =>
        ctx.isAdmin ? (
          <Button asChild>
            <Link to="/tarefas/nova">
              <Plus /> Nova tarefa
            </Link>
          </Button>
        ) : null
      }
    >
      {(ctx) => <PainelContent ctx={ctx} />}
    </AppShell>
  );
}

function PainelContent({ ctx }: { ctx: ReadyHousehold }) {
  const { data: tasks, isLoading } = useTasks(ctx.household.id);
  if (isLoading || !tasks) return <LoadingState label="Carregando tarefas..." />;

  const today = todayInBrazil();
  const counts = taskCounts(tasks, today);
  const points = pointsByMember(
    tasks,
    ctx.members.map((m) => m.id),
  );
  const pending = tasks
    .filter((t) => t.status === "pendente")
    .sort(
      (a, b) =>
        Number(isOverdue(b, today)) - Number(isOverdue(a, today)) ||
        a.due_date.localeCompare(b.due_date),
    );

  const stats = [
    {
      label: "Pendentes",
      value: counts.pending,
      icon: Clock,
      tone: "bg-secondary text-secondary-foreground",
    },
    {
      label: "Atrasadas",
      value: counts.overdue,
      icon: AlertTriangle,
      tone: "bg-overdue-soft text-overdue",
    },
    {
      label: "Concluídas",
      value: counts.done,
      icon: CheckCircle2,
      tone: "bg-success-soft text-success",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="surface-card flex items-center gap-4 p-5">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <div className="font-display text-3xl font-semibold leading-none">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-2" aria-labelledby="pendentes-title">
          <div className="flex items-center justify-between">
            <h2 id="pendentes-title" className="text-xl font-semibold">
              Tarefas em aberto
            </h2>
            <Link to="/tarefas" className="text-sm font-medium text-primary hover:underline">
              Ver todas
            </Link>
          </div>
          {pending.length === 0 ? (
            <div className="surface-card p-8 text-center text-muted-foreground">
              Nenhuma tarefa pendente. {ctx.isAdmin ? "Cadastre a primeira!" : "Casa em dia! 🌿"}
            </div>
          ) : (
            pending
              .slice(0, 8)
              .map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  members={ctx.members}
                  userId={ctx.userId}
                  isAdmin={ctx.isAdmin}
                  today={today}
                />
              ))
          )}
        </section>

        <aside className="space-y-6">
          <section className="surface-card p-5" aria-labelledby="pontos-title">
            <h2 id="pontos-title" className="text-xl font-semibold">
              Pontos por morador
            </h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">Só tarefas concluídas contam.</p>
            <PointsBars members={ctx.members} points={points} />
            <Link
              to="/equilibrio"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Ver equilíbrio da casa
            </Link>
          </section>
          <section className="surface-card space-y-3 p-5">
            <h2 className="text-xl font-semibold">Convide quem mora com você</h2>
            <p className="text-sm text-muted-foreground">
              Compartilhe este código para entrarem na residência.
            </p>
            <JoinCode code={ctx.household.join_code} />
          </section>
        </aside>
      </div>
    </div>
  );
}

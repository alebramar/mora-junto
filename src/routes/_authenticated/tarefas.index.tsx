import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell, LoadingState, type ReadyHousehold } from "@/components/morajunto/AppShell";
import { TaskCard } from "@/components/morajunto/TaskCard";
import { useTasks } from "@/lib/household";
import { isOverdue, todayInBrazil } from "@/lib/tasks-rules";

export const Route = createFileRoute("/_authenticated/tarefas/")({
  head: () => ({
    meta: [
      { title: "Tarefas — MoraJunto" },
      {
        name: "description",
        content: "Lista de tarefas da casa com responsáveis, prazos e status.",
      },
      { property: "og:title", content: "Tarefas — MoraJunto" },
      { property: "og:description", content: "Tarefas da casa com responsáveis e prazos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TarefasPage,
});

type Filter = "pendentes" | "atrasadas" | "minhas" | "concluidas" | "todas";

function TarefasPage() {
  return (
    <AppShell
      title="Tarefas"
      subtitle="Quem faz o quê, e até quando"
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
      {(ctx) => <TarefasContent ctx={ctx} />}
    </AppShell>
  );
}

function TarefasContent({ ctx }: { ctx: ReadyHousehold }) {
  const [filter, setFilter] = useState<Filter>("pendentes");
  const { data: tasks, isLoading } = useTasks(ctx.household.id);
  if (isLoading || !tasks) return <LoadingState label="Carregando tarefas..." />;

  const today = todayInBrazil();
  const filtered = tasks.filter((t) => {
    if (filter === "pendentes") return t.status === "pendente";
    if (filter === "atrasadas") return isOverdue(t, today);
    if (filter === "minhas") return t.responsible_user_id === ctx.userId && t.status === "pendente";
    if (filter === "concluidas") return t.status === "concluida";
    return true;
  });
  if (filter === "concluidas") {
    filtered.sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""));
  }

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="atrasadas">Atrasadas</TabsTrigger>
          <TabsTrigger value="minhas">Minhas</TabsTrigger>
          <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="surface-card p-10 text-center text-muted-foreground">
          Nenhuma tarefa por aqui.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              members={ctx.members}
              userId={ctx.userId}
              isAdmin={ctx.isAdmin}
              today={today}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell, LoadingState, type ReadyHousehold } from "@/components/morajunto/AppShell";
import { AdminOnly } from "@/components/morajunto/AdminOnly";
import { TaskForm } from "@/components/morajunto/TaskForm";
import { useTasks } from "@/lib/household";

export const Route = createFileRoute("/_authenticated/tarefas/$taskId")({
  head: () => ({
    meta: [
      { title: "Editar tarefa — MoraJunto" },
      { name: "description", content: "Altere os dados ou o responsável de uma tarefa pendente." },
      { property: "og:title", content: "Editar tarefa — MoraJunto" },
      { property: "og:description", content: "Edite uma tarefa pendente da casa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EditarTarefaPage,
});

function EditarTarefaPage() {
  return (
    <AppShell title="Editar tarefa" subtitle="Ajuste os dados ou troque o responsável">
      {(ctx) => <EditContent ctx={ctx} />}
    </AppShell>
  );
}

function EditContent({ ctx }: { ctx: ReadyHousehold }) {
  const { taskId } = Route.useParams();
  const { data: tasks, isLoading } = useTasks(ctx.household.id);
  if (!ctx.isAdmin) return <AdminOnly />;
  if (isLoading || !tasks) return <LoadingState />;
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return <AdminOnly message="Tarefa não encontrada." />;
  if (task.status === "concluida")
    return <AdminOnly message="Esta tarefa já foi concluída e não pode mais ser alterada." />;
  return <TaskForm householdId={ctx.household.id} members={ctx.members} task={task} />;
}

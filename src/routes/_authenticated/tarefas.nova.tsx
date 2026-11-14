import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/morajunto/AppShell";
import { AdminOnly } from "@/components/morajunto/AdminOnly";
import { TaskForm } from "@/components/morajunto/TaskForm";

export const Route = createFileRoute("/_authenticated/tarefas/nova")({
  head: () => ({
    meta: [
      { title: "Nova tarefa — MoraJunto" },
      {
        name: "description",
        content: "Cadastre uma tarefa e escolha o responsável, o prazo e o esforço.",
      },
      { property: "og:title", content: "Nova tarefa — MoraJunto" },
      { property: "og:description", content: "Cadastre uma nova tarefa da casa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NovaTarefaPage,
});

function NovaTarefaPage() {
  return (
    <AppShell title="Nova tarefa" subtitle="Defina o que precisa ser feito, por quem e até quando">
      {(ctx) =>
        ctx.isAdmin ? (
          <TaskForm householdId={ctx.household.id} members={ctx.members} />
        ) : (
          <AdminOnly />
        )
      }
    </AppShell>
  );
}

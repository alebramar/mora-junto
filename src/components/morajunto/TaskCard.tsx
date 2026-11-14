import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Check, Pencil, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Member, Task } from "@/lib/household";
import {
  EFFORT_LABEL,
  effortPoints,
  formatDateBR,
  formatDateTimeBR,
  isOverdue,
  type EffortLevel,
} from "@/lib/tasks-rules";

export function TaskCard({
  task,
  members,
  userId,
  isAdmin,
  today,
}: {
  task: Task;
  members: Member[];
  userId: string;
  isAdmin: boolean;
  today: string;
}) {
  const queryClient = useQueryClient();
  const responsible = members.find((m) => m.id === task.responsible_user_id);
  const overdue = isOverdue(task, today);
  const done = task.status === "concluida";
  const isMine = task.responsible_user_id === userId;
  const points = effortPoints(task.effort_level);

  const complete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "concluida" })
        .eq("id", task.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Tarefa concluída! +${points} ${points === 1 ? "ponto" : "pontos"}`);
      queryClient.invalidateQueries({ queryKey: ["tasks", task.household_id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <article
      className={`surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${overdue ? "border-overdue/50 bg-overdue-soft/40" : ""} ${done ? "opacity-80" : ""}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`font-sans text-base font-semibold ${done ? "line-through decoration-muted-foreground/60" : ""}`}
          >
            {task.title}
          </h3>
          {done ? (
            <Badge variant="success">Concluída</Badge>
          ) : overdue ? (
            <Badge variant="overdue">Atrasada</Badge>
          ) : (
            <Badge variant="pending">Pendente</Badge>
          )}
          <Badge variant="outline">
            {EFFORT_LABEL[task.effort_level as EffortLevel]} · {points}{" "}
            {points === 1 ? "pt" : "pts"}
          </Badge>
        </div>
        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4" aria-hidden="true" />
            {responsible?.name ?? "—"}
            {isMine && <span className="font-medium text-primary">(você)</span>}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 ${overdue ? "font-semibold text-overdue" : ""}`}
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Vence em {formatDateBR(task.due_date)}
          </span>
          {done && task.completed_at && (
            <span className="inline-flex items-center gap-1.5 text-success">
              <Check className="h-4 w-4" aria-hidden="true" />
              Concluída em {formatDateTimeBR(task.completed_at)}
            </span>
          )}
        </div>
      </div>
      {!done && (isMine || isAdmin) && (
        <div className="flex shrink-0 gap-2">
          {isAdmin && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/tarefas/$taskId" params={{ taskId: task.id }}>
                <Pencil /> Editar
              </Link>
            </Button>
          )}
          {isMine && (
            <Button size="sm" onClick={() => complete.mutate()} disabled={complete.isPending}>
              <Check /> {complete.isPending ? "Salvando..." : "Concluir"}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

// Regras de negócio puras do MoraJunto (sem acesso a dados), testadas em src/test/tasks-rules.test.ts.

export type EffortLevel = "baixo" | "medio" | "alto";
export type TaskStatus = "pendente" | "concluida";

export const EFFORT_POINTS: Record<EffortLevel, number> = { baixo: 1, medio: 2, alto: 3 };
export const EFFORT_LABEL: Record<EffortLevel, string> = {
  baixo: "Baixo",
  medio: "Médio",
  alto: "Alto",
};

export const BR_TIMEZONE = "America/Sao_Paulo";

/** Data de hoje no calendário brasileiro, no formato AAAA-MM-DD. */
export function todayInBrazil(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BR_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

type TaskLike = {
  status: string;
  due_date: string;
  effort_level: string;
  responsible_user_id: string;
};

/** Atrasada = pendente e com vencimento anterior a hoje. Concluídas nunca ficam atrasadas. */
export function isOverdue(
  task: Pick<TaskLike, "status" | "due_date">,
  today: string = todayInBrazil(),
): boolean {
  return task.status === "pendente" && task.due_date.slice(0, 10) < today;
}

export function effortPoints(level: string): number {
  return EFFORT_POINTS[level as EffortLevel] ?? 0;
}

/** Pontos acumulados por morador: só tarefas concluídas contam. */
export function pointsByMember(tasks: TaskLike[], memberIds: string[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const id of memberIds) result[id] = 0;
  for (const t of tasks) {
    if (t.status !== "concluida") continue;
    result[t.responsible_user_id] =
      (result[t.responsible_user_id] ?? 0) + effortPoints(t.effort_level);
  }
  return result;
}

export function taskCounts(
  tasks: Pick<TaskLike, "status" | "due_date">[],
  today: string = todayInBrazil(),
) {
  let pending = 0;
  let overdue = 0;
  let done = 0;
  for (const t of tasks) {
    if (t.status === "concluida") done++;
    else {
      pending++;
      if (isOverdue(t, today)) overdue++;
    }
  }
  return { pending, overdue, done };
}

/** AAAA-MM-DD -> DD/MM/AAAA sem passar por Date (evita deslocamento de fuso). */
export function formatDateBR(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateTimeBR(timestamp: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BR_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

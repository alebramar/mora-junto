import { describe, expect, it } from "vitest";
import {
  effortPoints,
  formatDateBR,
  isOverdue,
  pointsByMember,
  taskCounts,
  todayInBrazil,
} from "@/lib/tasks-rules";

describe("pontuação por esforço", () => {
  it("Baixo vale 1, Médio 2 e Alto 3 pontos", () => {
    expect(effortPoints("baixo")).toBe(1);
    expect(effortPoints("medio")).toBe(2);
    expect(effortPoints("alto")).toBe(3);
  });

  it("somente tarefas concluídas geram pontos", () => {
    const tasks = [
      { status: "concluida", due_date: "2026-01-01", effort_level: "alto", responsible_user_id: "ana" },
      { status: "concluida", due_date: "2026-01-02", effort_level: "baixo", responsible_user_id: "ana" },
      { status: "pendente", due_date: "2026-01-03", effort_level: "alto", responsible_user_id: "bia" },
    ];
    expect(pointsByMember(tasks, ["ana", "bia"])).toEqual({ ana: 4, bia: 0 });
  });
});

describe("atrasos", () => {
  it("tarefa pendente com vencimento anterior a hoje está atrasada", () => {
    expect(isOverdue({ status: "pendente", due_date: "2026-11-13" }, "2026-11-14")).toBe(true);
  });

  it("tarefa que vence hoje ainda não está atrasada", () => {
    expect(isOverdue({ status: "pendente", due_date: "2026-11-14" }, "2026-11-14")).toBe(false);
  });

  it("tarefa concluída nunca é considerada atrasada", () => {
    expect(isOverdue({ status: "concluida", due_date: "2026-01-01" }, "2026-11-14")).toBe(false);
  });

  it("usa o calendário de Brasília: 01:30 UTC do dia 15 ainda é dia 14 no Brasil", () => {
    expect(todayInBrazil(new Date("2026-11-15T01:30:00Z"))).toBe("2026-11-14");
  });

  it("contagem do painel separa pendentes, atrasadas e concluídas", () => {
    const tasks = [
      { status: "pendente", due_date: "2026-11-10" },
      { status: "pendente", due_date: "2026-11-20" },
      { status: "concluida", due_date: "2026-11-01" },
    ];
    expect(taskCounts(tasks, "2026-11-14")).toEqual({ pending: 2, overdue: 1, done: 1 });
  });

  it("formata a data no padrão brasileiro sem mudar o dia", () => {
    expect(formatDateBR("2026-03-01")).toBe("01/03/2026");
  });
});

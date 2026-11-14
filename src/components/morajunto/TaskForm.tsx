import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Member, Task } from "@/lib/household";
import { EFFORT_LABEL, EFFORT_POINTS, todayInBrazil, type EffortLevel } from "@/lib/tasks-rules";

const LEVELS: EffortLevel[] = ["baixo", "medio", "alto"];

export function TaskForm({
  householdId,
  members,
  task,
}: {
  householdId: string;
  members: Member[];
  task?: Task;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [responsible, setResponsible] = useState(task?.responsible_user_id ?? "");
  const [dueDate, setDueDate] = useState(task?.due_date ?? todayInBrazil());
  const [effort, setEffort] = useState<EffortLevel>((task?.effort_level as EffortLevel) ?? "medio");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Informe o título da tarefa.");
      return;
    }
    if (!responsible) {
      toast.error("Escolha quem será o responsável.");
      return;
    }
    if (!dueDate) {
      toast.error("Informe a data de vencimento.");
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      responsible_user_id: responsible,
      due_date: dueDate,
      effort_level: effort,
    };
    const { error } = task
      ? await supabase.from("tasks").update(payload).eq("id", task.id)
      : await supabase.from("tasks").insert({ ...payload, household_id: householdId });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(task ? "Tarefa atualizada." : "Tarefa cadastrada.");
    await queryClient.invalidateQueries({ queryKey: ["tasks", householdId] });
    navigate({ to: "/tarefas" });
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card mx-auto max-w-2xl space-y-5 p-5 md:p-7">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Lavar a louça do jantar"
          maxLength={120}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes que ajudam quem vai fazer"
          maxLength={1000}
          rows={3}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="responsible">Responsável</Label>
          <Select value={responsible} onValueChange={setResponsible}>
            <SelectTrigger id="responsible" aria-label="Responsável">
              <SelectValue placeholder="Escolha um morador" />
            </SelectTrigger>
            <SelectContent>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="due">Data de vencimento</Label>
          <Input
            id="due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Nível de esforço</legend>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              aria-pressed={effort === level}
              onClick={() => setEffort(level)}
              className="rounded-lg border bg-background px-3 py-3 text-center text-sm transition-colors hover:bg-accent aria-pressed:border-primary aria-pressed:bg-primary-soft aria-pressed:text-primary"
            >
              <div className="font-semibold">{EFFORT_LABEL[level]}</div>
              <div className="text-xs text-muted-foreground">
                {EFFORT_POINTS[level]} {EFFORT_POINTS[level] === 1 ? "ponto" : "pontos"}
              </div>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={() => navigate({ to: "/tarefas" })}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : task ? "Salvar alterações" : "Cadastrar tarefa"}
        </Button>
      </div>
    </form>
  );
}

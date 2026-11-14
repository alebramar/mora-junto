import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminOnly({
  message = "Somente o administrador da residência pode cadastrar e editar tarefas.",
}: {
  message?: string;
}) {
  return (
    <div className="surface-card mx-auto max-w-lg p-8 text-center">
      <Lock className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <p className="mt-3 text-muted-foreground">{message}</p>
      <Button variant="outline" className="mt-5" asChild>
        <Link to="/tarefas">Voltar para tarefas</Link>
      </Button>
    </div>
  );
}

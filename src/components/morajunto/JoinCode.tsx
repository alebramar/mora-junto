import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function JoinCode({ code }: { code: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary-soft/50 px-4 py-3">
      <div>
        <div className="text-xs font-medium text-muted-foreground">Código de acesso</div>
        <div className="font-mono text-xl font-semibold tracking-[0.25em] text-primary">{code}</div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Copiar código"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            toast.success("Código copiado.");
          } catch {
            toast.error("Não foi possível copiar. Anote o código.");
          }
        }}
      >
        <Copy />
      </Button>
    </div>
  );
}

import type { Member } from "@/lib/household";

/** Barras horizontais simples de pontos por morador (na ordem de entrada, sem ranking). */
export function PointsBars({
  members,
  points,
}: {
  members: Member[];
  points: Record<string, number>;
}) {
  const max = Math.max(1, ...members.map((m) => points[m.id] ?? 0));
  return (
    <ul className="space-y-3">
      {members.map((m) => {
        const value = points[m.id] ?? 0;
        return (
          <li key={m.id}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{m.name}</span>
              <span className="text-muted-foreground">
                {value} {value === 1 ? "ponto" : "pontos"}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

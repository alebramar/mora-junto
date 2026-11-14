import { Home } from "lucide-react";

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft ${big ? "h-11 w-11" : "h-9 w-9"}`}
      >
        <Home className={big ? "h-6 w-6" : "h-5 w-5"} aria-hidden="true" />
      </span>
      <span className={`font-display font-semibold tracking-tight ${big ? "text-3xl" : "text-xl"}`}>
        Mora<span className="text-terracotta">Junto</span>
      </span>
    </span>
  );
}

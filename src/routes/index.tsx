import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BarChart3, CalendarClock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/morajunto/Logo";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/casa-compartilhada.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MoraJunto — divida as tarefas da casa com equilíbrio" },
      {
        name: "description",
        content:
          "Organize as tarefas domésticas da sua república ou apartamento compartilhado: responsáveis, prazos e participação de cada morador.",
      },
      { property: "og:title", content: "MoraJunto — divida as tarefas da casa com equilíbrio" },
      {
        property: "og:description",
        content: "Responsáveis, prazos e participação de cada morador em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: Users, title: "Cada um sabe o seu", text: "Toda tarefa tem um responsável e um prazo." },
  {
    icon: CalendarClock,
    title: "Nada esquecido",
    text: "Tarefas atrasadas ficam em destaque no painel.",
  },
  {
    icon: BarChart3,
    title: "Divisão justa",
    text: "Veja a participação de cada morador, sem competição.",
  },
];

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/painel", replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen paper-texture">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <Button variant="ghost" asChild>
          <Link to="/auth">Entrar</Link>
        </Button>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2 md:pt-12">
        <div>
          <p className="mb-4 inline-block rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary">
            Para quem divide casa ou apartamento
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            A casa é de todos. <span className="text-terracotta">As tarefas também.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            O MoraJunto ajuda moradores a combinar quem faz o quê, acompanhar prazos e perceber se a
            divisão está equilibrada.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/auth" search={{ modo: "cadastro" }}>
                Criar conta grátis
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Já tenho conta</Link>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border shadow-card">
          <img
            src={heroImage}
            alt="Três estudantes cuidando juntos das tarefas de um apartamento"
            width={1280}
            height={960}
            className="h-full w-full object-cover"
          />
        </div>
      </main>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="surface-card p-5">
            <f.icon className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

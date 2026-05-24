import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { destinations } from "@/lib/data/destinations";
import { ArrowLeft, Calendar, CloudSun, Wallet, Bus, Plane, Banknote, FileCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/destinations/$id")({
  loader: ({ params }) => {
    const d = destinations.find((x) => x.id === params.id);
    if (!d) throw notFound();
    return { destination: d };
  },
  head: ({ loaderData }) => {
    const d = loaderData?.destination;
    return {
      meta: [
        { title: d ? `${d.city}, ${d.country} — Travel Guide | Wayfarer` : "Destination" },
        { name: "description", content: d?.tagline ?? "Travel guide" },
        { property: "og:title", content: d ? `${d.city}, ${d.country}` : "Destination" },
        { property: "og:description", content: d?.tagline ?? "" },
        { property: "og:image", content: d?.image ?? "" },
      ],
      links: [{ rel: "canonical", href: `/destinations/${d?.id ?? ""}` }],
    };
  },
  component: DestinationPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Destination not found</h1>
      <Link to="/destinations" className="mt-6 inline-block text-primary">← Back to destinations</Link>
    </div>
  ),
});

function DestinationPage() {
  const { destination: d } = Route.useLoaderData();

  const stats = [
    { icon: Calendar, label: "Best season", value: d.bestSeason },
    { icon: CloudSun, label: "Weather", value: d.weather },
    { icon: Wallet, label: "Est. cost", value: d.estCost },
    { icon: Bus, label: "Transport", value: d.transport },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img src={d.image} alt={d.city} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 text-white">
          <Link to="/destinations" className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All destinations
          </Link>
          <span className="text-xs uppercase tracking-widest text-white/70">{d.region} · {d.country}</span>
          <h1 className="mt-2 font-display text-6xl leading-none md:text-8xl">{d.city}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">{d.tagline}</p>
          <Button asChild className="mt-8 w-fit rounded-full bg-gradient-sunset text-primary-foreground shadow-glow hover:opacity-95">
            <Link to="/planner"><Sparkles className="mr-2 h-4 w-4" /> Plan a trip to {d.city}</Link>
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <Icon className="h-5 w-5 text-primary" />
              <div className="mt-3 text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 font-medium">{value}</div>
            </div>
          ))}
        </div>

        {/* International extras */}
        {d.region === "International" && (
          <div className="mt-12 grid gap-6 rounded-3xl bg-accent p-8 md:grid-cols-3">
            {[
              { icon: FileCheck, label: "Visa", v: d.visa },
              { icon: Plane, label: "Flight", v: d.flight },
              { icon: Banknote, label: "Currency", v: d.currency },
            ].map(({ icon: Icon, label, v }) => (
              <div key={label}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="h-4 w-4 text-primary" /> {label}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{v}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sections */}
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <Section title="Must-see places" items={d.highlights} />
          <Section title="Where to stay" items={d.hotels} />
          <Section title="Where to eat" items={d.restaurants} />
          {d.tips && <Section title="Travel tips" items={d.tips} />}
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      <ul className="mt-6 space-y-3">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-sunset" />
            <span className="text-sm">{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DestinationCard } from "@/components/site/DestinationCard";
import { destinations, pakistanCities, internationalCities } from "@/lib/data/destinations";

export const Route = createFileRoute("/destinations")({
  component: DestinationsPage,
  head: () => ({
    meta: [
      { title: "Destinations — Pakistan & International | Wayfarer" },
      { name: "description", content: "Explore curated destinations across Pakistan and the world — Hunza, Lahore, Dubai, Istanbul and more." },
      { property: "og:title", content: "Destinations | Wayfarer" },
      { property: "og:description", content: "Curated travel destinations in Pakistan and internationally." },
    ],
    links: [{ rel: "canonical", href: "/destinations" }],
  }),
});

function DestinationsPage() {
  const [filter, setFilter] = useState<"all" | "Pakistan" | "International">("all");
  const list =
    filter === "all" ? destinations : filter === "Pakistan" ? pakistanCities : internationalCities;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-20">
      <div className="max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-primary">Destinations</span>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">
          Stories waiting to be <em>lived</em>.
        </h1>
        <p className="mt-5 text-muted-foreground">
          From mountain villages in Gilgit-Baltistan to neon souqs in Dubai — find your next chapter.
        </p>
      </div>

      <div className="mt-10 inline-flex gap-1 rounded-full border border-border bg-card p-1">
        {[
          { k: "all", l: "All" },
          { k: "Pakistan", l: "Pakistan" },
          { k: "International", l: "International" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k as never)}
            className={`rounded-full px-5 py-2 text-sm transition-all ${
              filter === t.k ? "bg-gradient-sunset text-primary-foreground shadow-glow" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => <DestinationCard key={d.id} d={d} />)}
      </div>
    </div>
  );
}

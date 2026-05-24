import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HotelCard } from "@/components/site/HotelCard";
import { hotels } from "@/lib/data/hotels";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/hotels")({
  component: HotelsPage,
  head: () => ({
    meta: [
      { title: "Hotels — Stays curated for every budget | Wayfarer" },
      { name: "description", content: "Browse handpicked hotels across Pakistan and international destinations. Filter by budget and rating." },
      { property: "og:title", content: "Hotels | Wayfarer" },
      { property: "og:description", content: "Stays for every budget — from boutique lodges to five-star resorts." },
    ],
    links: [{ rel: "canonical", href: "/hotels" }],
  }),
});

function HotelsPage() {
  const [maxPrice, setMaxPrice] = useState(600);
  const [minRating, setMinRating] = useState(4);

  const list = useMemo(
    () => hotels.filter((h) => h.pricePerNight <= maxPrice && h.rating >= minRating),
    [maxPrice, minRating]
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pt-20">
      <div className="max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-primary">Stays</span>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">
          Sleep <em>somewhere</em> worth waking up to.
        </h1>
      </div>

      <div className="mt-10 grid gap-6 rounded-3xl border border-border bg-card p-6 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span>Max price / night</span>
            <span className="font-medium text-primary">${maxPrice}</span>
          </div>
          <Slider
            value={[maxPrice]}
            min={50}
            max={800}
            step={10}
            onValueChange={(v) => setMaxPrice(v[0])}
            className="mt-4"
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <span>Min rating</span>
            <span className="font-medium text-primary">{minRating.toFixed(1)} ★</span>
          </div>
          <Slider
            value={[minRating]}
            min={3}
            max={5}
            step={0.1}
            onValueChange={(v) => setMinRating(v[0])}
            className="mt-4"
          />
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((h) => <HotelCard key={h.id} h={h} />)}
      </div>
      {list.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">No hotels match those filters — try widening your search.</p>
      )}
    </div>
  );
}

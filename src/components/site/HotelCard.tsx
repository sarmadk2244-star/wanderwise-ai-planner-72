import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/lib/data/hotels";

export function HotelCard({ h }: { h: Hotel }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-card shadow-card transition-transform hover:-translate-y-1">
      <div className="aspect-[5/3] overflow-hidden">
        <img
          src={h.image}
          alt={h.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="space-y-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl leading-tight">{h.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {h.city}
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium">
            <Star className="h-3 w-3 fill-primary text-primary" /> {h.rating}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{h.rooms}</p>
        <div className="flex flex-wrap gap-1.5">
          {h.perks.map((p) => (
            <span key={p} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-secondary-foreground">{p}</span>
          ))}
        </div>
        <div className="flex items-end justify-between border-t border-border pt-4">
          <div>
            <div className="text-xs text-muted-foreground">From</div>
            <div className="font-display text-3xl text-gradient-sunset">${h.pricePerNight}</div>
            <div className="text-[11px] text-muted-foreground">per night · {h.reviews.toLocaleString()} reviews</div>
          </div>
          <Button className="rounded-full bg-gradient-sunset text-primary-foreground hover:opacity-95">Book</Button>
        </div>
      </div>
    </article>
  );
}

import { Link } from "@tanstack/react-router";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Destination } from "@/lib/data/destinations";

export function DestinationCard({ d, priority }: { d: Destination; priority?: boolean }) {
  return (
    <Link
      to="/destinations/$id"
      params={{ id: d.id }}
      className="group relative block overflow-hidden rounded-3xl shadow-card transition-transform duration-500 hover:-translate-y-1"
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        <img
          src={d.image}
          alt={`${d.city}, ${d.country}`}
          loading={priority ? "eager" : "lazy"}
          width={1024}
          height={1280}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute left-5 top-5">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur">
          {d.region}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="flex items-center gap-1 text-xs opacity-80">
          <MapPin className="h-3 w-3" /> {d.country}
        </div>
        <h3 className="mt-1 font-display text-3xl leading-tight">{d.city}</h3>
        <p className="mt-1 line-clamp-2 text-sm opacity-90">{d.tagline}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs opacity-80">{d.estCost}</span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-foreground transition-transform group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

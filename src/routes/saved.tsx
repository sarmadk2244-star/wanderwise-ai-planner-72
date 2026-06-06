import { createFileRoute, Link } from "@tanstack/react-router";
import { useSaved } from "@/lib/bookings";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Trash2, Hotel, Plane, Bus, MapPin, Cloud, CloudOff } from "lucide-react";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
  head: () => ({
    meta: [
      { title: "Save Center — Your trips & bookings | Wayfarer" },
      { name: "description", content: "All your saved hotels, flights, transport options and destinations in one place." },
    ],
  }),
});

const typeIcon = {
  hotel: Hotel,
  flight: Plane,
  transport: Bus,
  destination: MapPin,
} as const;

const typeLabel = {
  hotel: "Stay",
  flight: "Flight",
  transport: "Transport",
  destination: "Destination",
} as const;

function SavedPage() {
  const { items, remove, clear, isSynced } = useSaved();

  const grouped = {
    hotel: items.filter((i) => i.type === "hotel"),
    flight: items.filter((i) => i.type === "flight"),
    transport: items.filter((i) => i.type === "transport"),
    destination: items.filter((i) => i.type === "destination"),
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-primary">Save Center</span>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">
            Your <em>trip</em> wishlist.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Everything you've bookmarked — hotels, flights, transport and dream destinations — kept safely on your device.
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" className="rounded-full" onClick={clear}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear all
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-20 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-display text-3xl">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse destinations and tap the bookmark icon to start your wishlist.
          </p>
          <Button asChild className="mt-6 rounded-full bg-gradient-sunset text-primary-foreground">
            <Link to="/destinations">Explore destinations</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-12 space-y-14 pb-20">
          {(Object.keys(grouped) as Array<keyof typeof grouped>).map((key) => {
            const list = grouped[key];
            if (list.length === 0) return null;
            const Icon = typeIcon[key];
            return (
              <section key={key}>
                <div className="mb-6 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-3xl">{typeLabel[key]}s</h2>
                  <span className="text-sm text-muted-foreground">· {list.length}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((it) => (
                    <article key={it.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                      {it.image && (
                        <div className="aspect-[5/3] overflow-hidden">
                          <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="space-y-3 p-5">
                        <div>
                          <h3 className="font-display text-xl leading-tight">{it.title}</h3>
                          {it.subtitle && <p className="mt-1 text-xs text-muted-foreground">{it.subtitle}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {it.url && (
                            <Button asChild size="sm" className="flex-1 rounded-full bg-gradient-sunset text-primary-foreground">
                              <a href={it.url} target="_blank" rel="noopener noreferrer">
                                Open <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                          <Button variant="outline" size="icon" className="rounded-full" onClick={() => remove(it.id)} aria-label="Remove">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

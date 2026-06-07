import { ExternalLink, Bookmark, BookmarkCheck, Hotel, Plane, Bus, Home, Camera, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSaved, bookingLinks, type SavedItem } from "@/lib/bookings";
import { BookingFormDialog } from "@/components/site/BookingFormDialog";
import { toast } from "sonner";
import type { Destination } from "@/lib/data/destinations";

export function BookingPanel({ d }: { d: Destination }) {
  const { save, remove, has } = useSaved();

  const options: Array<{
    key: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    url: string;
    type: SavedItem["type"];
  }> = [
    {
      key: `hotel-${d.id}`,
      icon: Hotel,
      title: `Hotels in ${d.city}`,
      subtitle: "Booking.com · Best price guarantee",
      url: bookingLinks.hotels(d.city, d.country),
      type: "hotel",
    },
    {
      key: `airbnb-${d.id}`,
      icon: Home,
      title: `Stays in ${d.city}`,
      subtitle: "Airbnb · Apartments & unique stays",
      url: bookingLinks.airbnb(d.city),
      type: "hotel",
    },
    {
      key: `flight-${d.id}`,
      icon: Plane,
      title: `Flights to ${d.city}`,
      subtitle: "Google Flights · Compare airlines",
      url: bookingLinks.flights(d.city, d.country),
      type: "flight",
    },
    {
      key: `sky-${d.id}`,
      icon: Plane,
      title: `Skyscanner deals`,
      subtitle: `Cheapest fares to ${d.city}`,
      url: bookingLinks.skyscanner(d.city),
      type: "flight",
    },
    {
      key: `transport-${d.id}`,
      icon: Bus,
      title: `Transport options`,
      subtitle: "Rome2Rio · Trains, buses, ferries",
      url: bookingLinks.transport("Me", d.city),
      type: "transport",
    },
    {
      key: `tours-${d.id}`,
      icon: Camera,
      title: `Tours & experiences`,
      subtitle: "Viator · Local guides & activities",
      url: bookingLinks.tours(d.city),
      type: "transport",
    },
  ];

  const onSave = (o: typeof options[number]) => {
    if (has(o.key)) {
      remove(o.key);
      toast("Removed from Save Center");
    } else {
      save({
        id: o.key,
        type: o.type,
        title: o.title,
        subtitle: o.subtitle,
        url: o.url,
        image: d.image,
        meta: { city: d.city, country: d.country },
      });
      toast.success("Saved to your Save Center");
    }
  };

  return (
    <section className="mt-16">
      <div className="mb-6">
        <span className="text-xs uppercase tracking-widest text-primary">Book your trip</span>
        <h2 className="mt-2 font-display text-4xl">Reserve stays, flights & transport</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Book this tour with us directly, or search trusted partners. Save anything to your Save Center to revisit later.
        </p>
      </div>

      {/* Primary in-app booking CTA */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-gradient-soft p-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-sunset text-white shadow-glow">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-xl">Book {d.city} with Wayfarer</h3>
            <p className="text-sm text-muted-foreground">Fill a short form — CNIC, contact, travel date — and we'll send reminders before your trip.</p>
          </div>
        </div>
        <BookingFormDialog defaultTourPlace={d.city} defaultCountry={d.country} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => {
          const Icon = o.icon;
          const saved = has(o.key);
          return (
            <div key={o.key} className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-sunset text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl leading-tight">{o.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{o.subtitle}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <Button asChild className="flex-1 rounded-full bg-gradient-sunset text-primary-foreground hover:opacity-95">
                  <a href={o.url} target="_blank" rel="noopener noreferrer">
                    Book <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => onSave(o)}
                  aria-label={saved ? "Remove from saved" : "Save"}
                >
                  {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

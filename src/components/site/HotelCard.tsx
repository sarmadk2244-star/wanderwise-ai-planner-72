import { Star, MapPin, CalendarCheck, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/lib/data/hotels";
import { bookingLinks, useSaved } from "@/lib/bookings";
import { BookingFormDialog } from "@/components/site/BookingFormDialog";
import { toast } from "sonner";

export function HotelCard({ h }: { h: Hotel }) {
  const { save, remove, has } = useSaved();
  const saveId = `hotel-listing-${h.id}`;
  const saved = has(saveId);
  const bookingUrl = bookingLinks.hotels(h.name, h.city);

  const toggleSave = () => {
    if (saved) {
      remove(saveId);
      toast("Removed from Save Center");
    } else {
      save({
        id: saveId,
        type: "hotel",
        title: h.name,
        subtitle: `${h.city} · from $${h.pricePerNight}/night`,
        url: bookingUrl,
        image: h.image,
        meta: { city: h.city, price: h.pricePerNight, rating: h.rating },
      });
      toast.success("Saved to your Save Center");
    }
  };

  return (
    <article className="group overflow-hidden rounded-3xl bg-card shadow-card transition-transform hover:-translate-y-1">
      <div className="relative aspect-[5/3] overflow-hidden">
        <img
          src={h.image}
          alt={h.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <button
          onClick={toggleSave}
          aria-label={saved ? "Remove from saved" : "Save hotel"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/85 backdrop-blur transition hover:bg-background"
        >
          {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
        </button>
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
          <Button asChild className="rounded-full bg-gradient-sunset text-primary-foreground hover:opacity-95">
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
              Book <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

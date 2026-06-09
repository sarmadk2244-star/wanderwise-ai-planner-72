import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { destinations } from "@/lib/data/destinations";
import {
  ArrowLeft, Calendar, CloudSun, Wallet, Bus, Plane, Banknote, FileCheck,
  Sparkles, Shield, UtensilsCrossed, Building2, Heart, Lightbulb, Thermometer, Droplets, Wind, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Gallery } from "@/components/site/Gallery";
import { BookingPanel } from "@/components/site/BookingPanel";

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
        { name: "description", content: d?.description?.slice(0, 155) ?? d?.tagline ?? "Travel guide" },
        { property: "og:title", content: d ? `${d.city}, ${d.country}` : "Destination" },
        { property: "og:description", content: d?.tagline ?? "" },
        { property: "og:image", content: d?.image ?? "" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: d?.image ?? "" },
      ],
      links: [{ rel: "canonical", href: `/destinations/${d?.id ?? ""}` }],
    };
  },
  component: DestinationPage,
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Couldn't load destination</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-full bg-gradient-sunset px-5 py-2.5 text-sm text-primary-foreground">Try again</button>
    </div>
  ),
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

  const weatherChips = [
    { icon: Thermometer, label: "Temp", value: d.weatherDetail.temp },
    { icon: Droplets, label: "Humidity", value: d.weatherDetail.humidity },
    { icon: Wind, label: "Wind", value: d.weatherDetail.wind },
  ];

  const budgetItems = [
    { label: "Flights", v: d.budget.flights },
    { label: "Stay", v: d.budget.stay },
    { label: "Food", v: d.budget.food },
    { label: "Activities", v: d.budget.activities },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">
        <img src={d.image} alt={`${d.city}, ${d.country}`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 text-white">
          <Link to="/destinations" className="mb-6 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All destinations
          </Link>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
            <MapPin className="h-3 w-3" /> {d.region} · {d.country}
          </div>
          <h1 className="mt-2 font-display text-6xl leading-none md:text-8xl">{d.city}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">{d.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SafetyBadge rating={d.safety} />
            <Button asChild className="rounded-full bg-gradient-sunset text-primary-foreground shadow-glow hover:opacity-95">
              <Link to="/planner"><Sparkles className="mr-2 h-4 w-4" /> Plan a trip to {d.city}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Description */}
        <p className="max-w-3xl text-lg leading-relaxed text-foreground/80">{d.description}</p>

        {/* Quick stats */}
        <div className="mt-12 grid gap-4 md:grid-cols-4">
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

        {/* Gallery */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary">Gallery</span>
              <h2 className="mt-2 font-display text-4xl">Through the lens</h2>
              <p className="mt-2 text-sm text-muted-foreground">Tap any photo to open the full-screen viewer.</p>
            </div>
            <span className="text-sm text-muted-foreground">{[d.image, ...d.gallery].length} photos</span>
          </div>
          <Gallery images={[d.image, ...d.gallery]} alt={`${d.city}, ${d.country}`} />
        </section>

        {/* Weather & Budget */}
        <section className="mt-20 grid gap-6 md:grid-cols-2">
          <Card title="Weather right now" icon={CloudSun}>
            <div className="grid grid-cols-3 gap-4">
              {weatherChips.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-accent p-4 text-center">
                  <Icon className="mx-auto h-5 w-5 text-primary" />
                  <div className="mt-2 text-xs text-muted-foreground">{label}</div>
                  <div className="font-medium">{value}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{d.weather}. Best months: {d.bestSeason}.</p>
          </Card>
          <Card title="Estimated budget" icon={Wallet}>
            <ul className="divide-y divide-border">
              {budgetItems.map((b) => (
                <li key={b.label} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">{b.label}</span>
                  <span className="text-sm font-medium">{b.v}</span>
                </li>
              ))}
              <li className="flex items-center justify-between pt-3 font-medium">
                <span>Total</span>
                <span className="text-gradient-sunset">{d.estCost}</span>
              </li>
            </ul>
          </Card>
        </section>

        {/* Sections */}
        <section className="mt-20 grid gap-12 md:grid-cols-2">
          <Section icon={Building2} title="Must-see places" items={d.highlights} />
          <Section icon={Building2} title="Where to stay" items={d.hotels} />
          <Section icon={UtensilsCrossed} title="Where to eat" items={d.restaurants} />
          <Section icon={Lightbulb} title="Travel tips" items={d.tips} />
        </section>

        {/* Culture */}
        <section className="mt-16 grid gap-6 rounded-3xl border border-border bg-card p-8 shadow-card md:grid-cols-[auto_1fr] md:items-start md:p-12">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-aurora text-white shadow-glow">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-3xl">Local culture</h2>
            <p className="mt-3 text-foreground/80">{d.culture}</p>
          </div>
        </section>

        {/* Booking & transport */}
        <BookingPanel d={d} />



        {/* CTA */}
        <section className="mt-20 overflow-hidden rounded-4xl bg-gradient-aurora p-10 text-white shadow-glow md:p-16">
          <h2 className="font-display text-4xl md:text-5xl">Ready to go to {d.city}?</h2>
          <p className="mt-3 max-w-md text-white/85">Let our AI craft a day-by-day itinerary tailored to your travel style and budget.</p>
          <Button asChild size="lg" className="mt-8 rounded-full bg-white text-foreground hover:bg-white/90">
            <Link to="/planner"><Sparkles className="mr-2 h-4 w-4" /> Generate my trip</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-display text-2xl">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Section({ title, items, icon: Icon }: { title: string; items: string[]; icon: React.ElementType }) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      </div>
      <ul className="space-y-3">
        {items.map((x) => (
          <li key={x} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-sunset" />
            <span className="text-sm">{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SafetyBadge({ rating }: { rating: number }) {
  const label = ["", "Use caution", "Use caution", "Generally safe", "Safe", "Very safe"][rating] ?? "Safe";
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur">
      <Shield className="h-3.5 w-3.5" />
      <span>Safety: {label}</span>
      <span className="ml-1">{"●".repeat(rating)}<span className="opacity-30">{"●".repeat(5 - rating)}</span></span>
    </div>
  );
}

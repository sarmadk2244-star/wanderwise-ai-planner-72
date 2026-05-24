import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Calendar, Users, Wallet, MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { destinations } from "@/lib/data/destinations";
import { hotels } from "@/lib/data/hotels";
import { DestinationCard } from "@/components/site/DestinationCard";
import { HotelCard } from "@/components/site/HotelCard";
import heroImg from "@/assets/hero-mountains.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Wayfarer — AI Trip Planner for Pakistan & Beyond" },
      { name: "description", content: "Plan unforgettable trips across Pakistan and the world with an AI concierge — itineraries, hotels, and insider tips." },
      { property: "og:title", content: "Wayfarer — AI Trip Planner" },
      { property: "og:description", content: "AI-crafted journeys across Pakistan and the world." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const popular = destinations.slice(0, 6);
  const featured = hotels.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Sunset over Karakoram mountains"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-background" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-32 pt-28 text-center text-white md:pt-40">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs">
              <Sparkles className="h-3 w-3" /> Powered by AI travel concierge
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
              Where will the <em className="italic text-gradient-sunset">sunset</em> find you next?
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-white/85 md:text-lg">
              From the peaks of Hunza to the souqs of Istanbul — design your perfect journey
              in seconds with our AI travel planner.
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/planner", search: { q } as never });
            }}
            className="mx-auto mt-10 max-w-3xl animate-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="glass flex flex-col gap-2 rounded-3xl p-3 text-left text-foreground md:flex-row md:items-center md:rounded-full md:gap-0 md:p-2">
              <div className="flex flex-1 items-center gap-2 px-4">
                <MapPin className="h-4 w-4 text-primary" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Hunza, Dubai, Istanbul…"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="hidden h-8 w-px bg-border md:block" />
              <div className="flex items-center gap-2 px-4 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" /> Anytime
              </div>
              <div className="hidden h-8 w-px bg-border md:block" />
              <div className="flex items-center gap-2 px-4 text-sm text-muted-foreground">
                <Users className="h-4 w-4" /> 2 travelers
              </div>
              <Button type="submit" className="rounded-full bg-gradient-sunset text-primary-foreground shadow-glow hover:opacity-95 md:h-12 md:px-6">
                <Search className="mr-2 h-4 w-4" /> Plan with AI
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/70">
            <span>★ 4.9 traveler rating</span>
            <span>· 12,000+ itineraries crafted</span>
            <span>· 24/7 AI concierge</span>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="mx-auto max-w-7xl px-6 pt-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary">Wanderlist</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Popular destinations</h2>
          </div>
          <Link to="/destinations" className="hidden items-center gap-1 text-sm text-foreground/70 hover:text-primary md:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((d, i) => (
            <DestinationCard key={d.id} d={d} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* AI PLANNER CTA */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-aurora p-10 text-white shadow-glow md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-float" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs">AI Concierge</span>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                Tell us your <em>vibe</em>. We'll write the rest.
              </h2>
              <p className="mt-4 max-w-md text-white/85">
                Honeymoon in Skardu? Family weekend in Murree? A 10-day Turkey adventure?
                Our AI builds detailed, day-by-day plans with hotels, meals, and budgets.
              </p>
              <Button asChild size="lg" className="mt-8 rounded-full bg-white text-foreground hover:bg-white/90">
                <Link to="/planner"><Sparkles className="mr-2 h-4 w-4" /> Launch AI Planner</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: Wallet, t: "Smart budgeting", d: "Right-sized to your wallet." },
                { icon: Calendar, t: "Day-by-day plans", d: "Morning, noon, and night." },
                { icon: MapPin, t: "Local gems", d: "Beyond the tourist trail." },
                { icon: Star, t: "Top-rated stays", d: "Hotels we'd book ourselves." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="glass-dark rounded-2xl p-4">
                  <Icon className="h-5 w-5" />
                  <div className="mt-2 font-medium">{t}</div>
                  <div className="text-xs text-white/70">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary">Stays</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Featured hotels</h2>
          </div>
          <Link to="/hotels" className="hidden items-center gap-1 text-sm text-foreground/70 hover:text-primary md:inline-flex">
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((h) => <HotelCard key={h.id} h={h} />)}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-10 text-center md:grid-cols-4">
          {[
            ["50+", "Curated destinations"],
            ["12k", "AI itineraries crafted"],
            ["4.9", "Average traveler rating"],
            ["24/7", "Concierge support"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-5xl text-gradient-sunset">{n}</div>
              <div className="mt-2 text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

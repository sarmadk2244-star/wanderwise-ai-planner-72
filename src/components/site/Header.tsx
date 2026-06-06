import { Link } from "@tanstack/react-router";
import { Compass, Menu, X, Bookmark } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSaved } from "@/lib/bookings";

const links = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/hotels", label: "Hotels" },
  { to: "/planner", label: "AI Planner" },
  { to: "/saved", label: "Saved" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { items } = useSaved();
  const savedCount = items.length;
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <div className="glass flex items-center justify-between rounded-full px-4 py-2.5 shadow-card">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-aurora text-white shadow-glow">
              <Compass className="h-4 w-4" />
            </span>
            <span className="font-display text-2xl leading-none">Wayfarer</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-foreground/80 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary font-medium" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Link to="/saved" className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent" aria-label="Save Center">
              <Bookmark className="h-4 w-4" />
              {savedCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-sunset px-1 text-[10px] font-medium text-primary-foreground">
                  {savedCount}
                </span>
              )}
            </Link>
            <Button asChild className="rounded-full bg-gradient-sunset text-primary-foreground shadow-glow hover:opacity-95">
              <Link to="/planner">Plan a trip</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setOpen((s) => !s)} aria-label="Menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="glass mt-2 flex flex-col gap-1 rounded-3xl p-3 md:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-1 rounded-full bg-gradient-sunset text-primary-foreground">
              <Link to="/planner" onClick={() => setOpen(false)}>Plan a trip</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

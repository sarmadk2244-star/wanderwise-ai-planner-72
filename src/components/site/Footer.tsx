import { Link } from "@tanstack/react-router";
import { Compass, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-gradient-soft">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-aurora text-white">
              <Compass className="h-4 w-4" />
            </span>
            <span className="font-display text-2xl">Wayfarer</span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            AI-crafted journeys across Pakistan and the world. From the peaks of Hunza
            to the souqs of Istanbul — plan smarter, travel deeper.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Twitter, Mail].map((Icon, i) => (
              <span key={i} className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-card">
                <Icon className="h-4 w-4 text-foreground/70" />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/hotels">Hotels</Link></li>
            <li><Link to="/planner">AI Planner</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/trust">Trust & Privacy</Link></li>
          </ul>
        </div>

      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Wayfarer. Crafted with care.
      </div>
    </footer>
  );
}

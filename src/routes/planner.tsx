import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { generateTripPlan } from "@/lib/ai-planner.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "AI Trip Planner — Build your perfect journey | Wayfarer" },
      { name: "description", content: "Generate a personalized, day-by-day travel itinerary with our AI concierge. Pakistan and international destinations." },
      { property: "og:title", content: "AI Trip Planner | Wayfarer" },
      { property: "og:description", content: "A personal AI travel concierge — itineraries, hotels, budgets, and tips." },
    ],
    links: [{ rel: "canonical", href: "/planner" }],
  }),
});

const tripTypes = ["Family", "Friends", "Honeymoon", "Solo", "Adventure"] as const;

function PlannerPage() {
  const generate = useServerFn(generateTripPlan);
  const [destination, setDestination] = useState("Hunza, Pakistan");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("PKR 80,000 – 120,000");
  const [tripType, setTripType] = useState<typeof tripTypes[number]>("Friends");
  const [notes, setNotes] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPlan("");
    try {
      const res = await generate({ data: { destination, days, travelers, budget, tripType, notes } });
      setPlan(res.plan);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-20">
      <div className="max-w-3xl">
        <span className="text-xs uppercase tracking-widest text-primary">AI Concierge</span>
        <h1 className="mt-3 font-display text-5xl md:text-7xl">
          Your trip, <em>handcrafted</em> in seconds.
        </h1>
        <p className="mt-5 text-muted-foreground">
          Tell us the basics. We'll write a detailed plan with hotels, food, budget, and day-by-day routes.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[420px_1fr]">
        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="h-fit space-y-5 rounded-3xl border border-border bg-card p-7 shadow-card"
        >
          <div className="space-y-2">
            <Label>Destination</Label>
            <Input value={destination} onChange={(e) => setDestination(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Days</Label>
              <Input type="number" min={1} max={30} value={days} onChange={(e) => setDays(+e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Travelers</Label>
              <Input type="number" min={1} max={20} value={travelers} onChange={(e) => setTravelers(+e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Budget</Label>
            <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. PKR 100,000 or USD 1,500" />
          </div>
          <div className="space-y-2">
            <Label>Trip type</Label>
            <Select value={tripType} onValueChange={(v) => setTripType(v as never)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {tripTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Anything we should know? <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dietary needs, accessibility, must-see spots…"
              rows={3}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-sunset text-primary-foreground shadow-glow hover:opacity-95"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Crafting your trip…</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate itinerary</>
            )}
          </Button>
        </form>

        {/* Output */}
        <div className="min-h-[520px] rounded-3xl border border-border bg-gradient-soft p-8 md:p-10">
          {!plan && !loading && (
            <div className="grid h-full place-items-center text-center text-muted-foreground">
              <div>
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-aurora text-white shadow-glow">
                  <Sparkles className="h-7 w-7" />
                </div>
                <p>Your AI-crafted itinerary will appear here.</p>
              </div>
            </div>
          )}
          {loading && (
            <div className="grid h-full place-items-center">
              <div className="text-center text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4">Consulting local guides and weather charts…</p>
              </div>
            </div>
          )}
          {plan && <MarkdownPlan text={plan} />}
        </div>
      </div>
    </div>
  );
}

/** Lightweight markdown renderer — headings, lists, bold, paragraphs. */
function MarkdownPlan({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  const flushList = (key: number) => {
    if (listBuf.length) {
      out.push(
        <ul key={`ul-${key}`} className="my-3 space-y-1.5 pl-5">
          {listBuf.map((it, i) => (
            <li key={i} className="list-disc text-sm leading-relaxed text-foreground/85">
              {inline(it)}
            </li>
          ))}
        </ul>
      );
      listBuf = [];
    }
  };
  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (/^###\s+/.test(line)) { flushList(i); out.push(<h3 key={i} className="mt-6 font-display text-2xl">{line.replace(/^###\s+/, "")}</h3>); }
    else if (/^##\s+/.test(line)) { flushList(i); out.push(<h2 key={i} className="mt-8 font-display text-3xl text-gradient-sunset">{line.replace(/^##\s+/, "")}</h2>); }
    else if (/^#\s+/.test(line)) { flushList(i); out.push(<h1 key={i} className="mt-2 font-display text-4xl">{line.replace(/^#\s+/, "")}</h1>); }
    else if (/^\s*[-*]\s+/.test(line)) { listBuf.push(line.replace(/^\s*[-*]\s+/, "")); }
    else if (line.trim() === "") { flushList(i); }
    else { flushList(i); out.push(<p key={i} className="mt-2 text-sm leading-relaxed text-foreground/85">{inline(line)}</p>); }
  });
  flushList(lines.length);
  return <article className="max-w-none">{out}</article>;
}

function inline(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p) ? <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
}

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBooking, BookingInputSchema } from "@/lib/bookings-db.functions";
import { useAuthUser } from "@/hooks/use-auth-user";

type Props = {
  defaultTourPlace?: string;
  defaultCountry?: string;
  trigger?: React.ReactNode;
};

export function BookingFormDialog({ defaultTourPlace = "", defaultCountry = "", trigger }: Props) {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const submit = useServerFn(createBooking);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    cnic: "",
    phone: "",
    email: user?.email ?? "",
    tour_place: defaultTourPlace,
    country: defaultCountry,
    travel_date: "",
    travelers: 1,
    notes: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book a tour");
      navigate({ to: "/auth" });
      return;
    }
    const parsed = BookingInputSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    try {
      await submit({ data: parsed.data });
      toast.success("Booking confirmed — we'll remind you before travel date");
      setOpen(false);
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="rounded-full bg-gradient-sunset text-primary-foreground shadow-glow hover:opacity-95">
            <CalendarCheck className="mr-1.5 h-4 w-4" /> Book this tour
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Book your tour</DialogTitle>
          <DialogDescription>
            Fill in your details — we'll send reminders as your travel date approaches.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cnic">CNIC / ID number</Label>
              <Input id="cnic" placeholder="12345-1234567-1" value={form.cnic} onChange={(e) => set("cnic", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+92 300 0000000" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tour_place">Tour place</Label>
              <Input id="tour_place" value={form.tour_place} onChange={(e) => set("tour_place", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={form.country} onChange={(e) => set("country", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="travel_date">Travel date</Label>
              <Input
                id="travel_date"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.travel_date}
                onChange={(e) => set("travel_date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="travelers">Number of travelers</Label>
              <Input
                id="travelers"
                type="number"
                min={1}
                max={50}
                value={form.travelers}
                onChange={(e) => set("travelers", Math.max(1, +e.target.value || 1))}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Notes <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Dietary needs, accessibility, special requests…" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-sunset text-primary-foreground hover:opacity-95"
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Confirm booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

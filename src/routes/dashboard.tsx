import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Bell, CalendarDays, Trash2, Settings, MapPin, Users, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listBookings, deleteBooking } from "@/lib/bookings-db.functions";
import {
  listNotifications,
  markNotificationRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/notifications.functions";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — Bookings & reminders | Wayfarer" },
      { name: "description", content: "Manage your bookings, reminder notifications, and notification preferences." },
    ],
  }),
});

type Booking = {
  id: string;
  full_name: string;
  cnic: string;
  phone: string;
  tour_place: string;
  country: string | null;
  travel_date: string;
  travelers: number;
  status: string;
  notes: string | null;
  created_at: string;
};

type Notification = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  created_at: string;
};

type Prefs = {
  email_enabled: boolean;
  in_app_enabled: boolean;
  reminder_days: number[];
  email_address: string | null;
};

const DAY_OPTIONS = [30, 14, 7, 3, 1, 0];

function DashboardPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthUser();

  const fetchBookings = useServerFn(listBookings);
  const removeBooking = useServerFn(deleteBooking);
  const fetchNotifications = useServerFn(listNotifications);
  const toggleRead = useServerFn(markNotificationRead);
  const removeNotif = useServerFn(deleteNotification);
  const fetchPrefs = useServerFn(getNotificationPreferences);
  const savePrefs = useServerFn(updateNotificationPreferences);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    (async () => {
      try {
        const [b, n, p] = await Promise.all([fetchBookings(), fetchNotifications(), fetchPrefs()]);
        setBookings(b.bookings as Booking[]);
        setNotifs(n.notifications as Notification[]);
        setPrefs(p.prefs as Prefs);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, authLoading, navigate, fetchBookings, fetchNotifications, fetchPrefs]);

  const onDeleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await removeBooking({ data: { id } });
    setBookings((b) => b.filter((x) => x.id !== id));
    toast.success("Booking removed");
  };

  const onToggleNotif = async (n: Notification) => {
    await toggleRead({ data: { id: n.id, read: !n.read } });
    setNotifs((arr) => arr.map((x) => (x.id === n.id ? { ...x, read: !n.read } : x)));
  };

  const onDeleteNotif = async (id: string) => {
    await removeNotif({ data: { id } });
    setNotifs((arr) => arr.filter((x) => x.id !== id));
  };

  const togglePrefDay = (d: number) => {
    if (!prefs) return;
    const next = prefs.reminder_days.includes(d)
      ? prefs.reminder_days.filter((x) => x !== d)
      : [...prefs.reminder_days, d].sort((a, b) => b - a);
    setPrefs({ ...prefs, reminder_days: next });
  };

  const onSavePrefs = async () => {
    if (!prefs) return;
    setSaving(true);
    try {
      await savePrefs({
        data: {
          email_enabled: prefs.email_enabled,
          in_app_enabled: prefs.in_app_enabled,
          reminder_days: prefs.reminder_days,
          email_address: prefs.email_address ?? "",
        },
      });
      toast.success("Notification preferences saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.travel_date >= today);
  const past = bookings.filter((b) => b.travel_date < today);
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-16 pb-24">
      <div className="mb-10">
        <span className="text-xs uppercase tracking-widest text-primary">Your dashboard</span>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">Bookings & reminders</h1>
        <p className="mt-3 text-muted-foreground">
          Manage your tour bookings, see upcoming reminders, and control how we notify you.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Left: bookings + notifications */}
        <div className="space-y-12">
          {/* Bookings */}
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl">Upcoming bookings</h2>
                <p className="text-sm text-muted-foreground">{upcoming.length} scheduled</p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/destinations">Book another</Link>
              </Button>
            </div>
            {upcoming.length === 0 ? (
              <EmptyState
                title="No upcoming bookings"
                body="Browse destinations and use the in-app booking form to schedule your next trip."
                cta={
                  <Button asChild className="rounded-full bg-gradient-sunset text-primary-foreground">
                    <Link to="/destinations">Explore destinations</Link>
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} b={b} onDelete={() => onDeleteBooking(b.id)} />
                ))}
              </div>
            )}

            {past.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 font-display text-2xl text-muted-foreground">Past trips</h3>
                <div className="grid gap-3">
                  {past.map((b) => (
                    <BookingCard key={b.id} b={b} onDelete={() => onDeleteBooking(b.id)} muted />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Notifications */}
          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
                </p>
              </div>
            </div>
            {notifs.length === 0 ? (
              <EmptyState title="No notifications yet" body="Reminders for upcoming bookings will appear here." />
            ) : (
              <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
                {notifs.map((n) => (
                  <li key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? "bg-accent/20" : ""}`}>
                    <span className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full ${!n.read ? "bg-gradient-sunset text-white" : "bg-muted text-muted-foreground"}`}>
                      <Bell className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onToggleNotif(n)} aria-label={n.read ? "Mark unread" : "Mark read"}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteNotif(n.id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right: notification settings */}
        <aside className="h-fit space-y-6 rounded-3xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-sunset text-white">
              <Settings className="h-4 w-4" />
            </span>
            <h2 className="font-display text-2xl">Notification settings</h2>
          </div>

          {prefs && (
            <>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">In-app notifications</p>
                  <p className="text-xs text-muted-foreground">Bell icon + dashboard</p>
                </div>
                <Switch
                  checked={prefs.in_app_enabled}
                  onCheckedChange={(v) => setPrefs({ ...prefs, in_app_enabled: v })}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Email notifications</p>
                  <p className="text-xs text-muted-foreground">Sent to your inbox</p>
                </div>
                <Switch
                  checked={prefs.email_enabled}
                  onCheckedChange={(v) => setPrefs({ ...prefs, email_enabled: v })}
                />
              </div>

              {prefs.email_enabled && (
                <div className="space-y-1.5">
                  <Label htmlFor="email_addr">Email address</Label>
                  <Input
                    id="email_addr"
                    type="email"
                    placeholder={user?.email ?? "you@example.com"}
                    value={prefs.email_address ?? ""}
                    onChange={(e) => setPrefs({ ...prefs, email_address: e.target.value })}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Email delivery requires an email domain to be configured. In-app reminders work right now.
                  </p>
                </div>
              )}

              <div>
                <p className="mb-2 text-sm font-medium">Remind me</p>
                <div className="flex flex-wrap gap-2">
                  {DAY_OPTIONS.map((d) => {
                    const active = prefs.reminder_days.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => togglePrefDay(d)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                          active
                            ? "border-transparent bg-gradient-sunset text-primary-foreground"
                            : "border-border bg-background hover:bg-accent"
                        }`}
                      >
                        {d === 0 ? "On the day" : `${d} day${d > 1 ? "s" : ""} before`}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  We'll send a reminder at each selected interval before your travel date.
                </p>
              </div>

              <Button
                onClick={onSavePrefs}
                disabled={saving}
                className="w-full rounded-full bg-gradient-sunset text-primary-foreground hover:opacity-95"
              >
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save preferences"}
              </Button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function BookingCard({ b, onDelete, muted }: { b: Booking; onDelete: () => void; muted?: boolean }) {
  const daysAway = Math.ceil(
    (new Date(b.travel_date).getTime() - new Date(new Date().toISOString().slice(0, 10)).getTime()) /
      86400000,
  );
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between ${muted ? "opacity-70" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl">{b.tour_place}</h3>
          {b.country && <span className="text-sm text-muted-foreground">{b.country}</span>}
          <Badge variant="outline" className="capitalize">{b.status}</Badge>
          {!muted && daysAway >= 0 && (
            <Badge className="bg-gradient-sunset text-primary-foreground">
              {daysAway === 0 ? "Today" : `${daysAway}d to go`}
            </Badge>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {b.travel_date}</span>
          <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {b.travelers} traveler{b.travelers > 1 ? "s" : ""}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {b.full_name}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete booking">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function EmptyState({ title, body, cta }: { title: string; body: string; cta?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="font-display text-xl">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}

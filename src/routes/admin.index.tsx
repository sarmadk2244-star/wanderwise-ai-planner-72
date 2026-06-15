import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetStats } from "@/lib/admin.functions";
import { Calendar, Inbox, Users, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Overview });

function StatCard({ icon: Icon, label, value, tint }: { icon: typeof Calendar; label: string; value: number | string; tint: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-full ${tint}`}>
          <Icon className="h-5 w-5 text-white" />
        </span>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="font-display text-2xl">{value}</div>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const fn = useServerFn(adminGetStats);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => fn(),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading stats…</div>;
  if (error) return <div className="text-sm text-destructive">{(error as Error).message}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Users" value={data.totalUsers} tint="bg-gradient-aurora" />
        <StatCard icon={Calendar} label="Bookings" value={data.totalBookings} tint="bg-gradient-sunset" />
        <StatCard icon={Inbox} label="Open Tickets" value={data.openContacts} tint="bg-primary" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={data.bookingsByStatus.confirmed ?? 0} tint="bg-emerald-500" />
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-xl">Bookings by status</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {(["pending", "confirmed", "cancelled", "completed"] as const).map((s) => (
            <div key={s} className="rounded-xl bg-card/40 p-4">
              <div className="text-xs uppercase text-muted-foreground">{s}</div>
              <div className="font-display text-2xl">{data.bookingsByStatus[s] ?? 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

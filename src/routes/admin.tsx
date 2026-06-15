import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  Users,
  Send,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin · Wayfarer" }] }),
});

const navItems: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/messages", label: "Support Inbox", icon: Inbox },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/send", label: "Send Message", icon: Send },
];

function AdminLayout() {
  const { user, loading: authLoading } = useAuthUser();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const navigate = useNavigate();
  const claimFn = useServerFn(claimFirstAdmin);
  const claimMut = useMutation({
    mutationFn: () => claimFn(),
    onSuccess: () => {
      toast.success("You're now an admin. Reloading…");
      setTimeout(() => window.location.reload(), 600);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24">
        <div className="glass rounded-3xl p-10 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 font-display text-3xl">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) doesn't have admin privileges. If this is a fresh
            site with no admins yet, you can claim the first admin role below. Otherwise,
            ask an existing admin to grant you access.
          </p>
          <p className="mt-3 break-all rounded-md bg-muted/40 p-3 text-xs font-mono">
            Your user id: {user.id}
          </p>
          <Button
            className="mt-5 rounded-full bg-gradient-sunset text-primary-foreground shadow-glow"
            onClick={() => claimMut.mutate()}
            disabled={claimMut.isPending}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            {claimMut.isPending ? "Claiming…" : "Claim first admin role"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Admin Console</h1>
          <p className="text-sm text-muted-foreground">Manage bookings, users, and support.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[220px,1fr]">
        <aside className="glass rounded-2xl p-3 md:sticky md:top-24 md:self-start">
          <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to as never}
                  className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm hover:bg-accent"
                  activeProps={{ className: "bg-accent text-primary font-medium" }}
                  activeOptions={{ exact: item.exact ?? false }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bell, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  listNotifications,
  markAllNotificationsRead,
} from "@/lib/notifications.functions";

type Notif = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  created_at: string;
};

export function NotificationBell() {
  const fetchList = useServerFn(listNotifications);
  const markAll = useServerFn(markAllNotificationsRead);
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetchList();
      setItems(res.notifications as Notif[]);
    } catch {
      /* not signed in or transient */
    }
  }, [fetchList]);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setAuthed(!!data.user);
      if (data.user) load();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!active) return;
      setAuthed(!!session?.user);
      if (session?.user) load();
      else setItems([]);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [load]);

  if (!authed) return null;
  const unread = items.filter((i) => !i.read).length;

  const onMarkAll = async () => {
    await markAll();
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-sunset px-1 text-[10px] font-medium text-primary-foreground">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-popover shadow-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-display text-base">Notifications</span>
              {unread > 0 && (
                <button onClick={onMarkAll} className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
              ) : (
                items.slice(0, 20).map((n) => (
                  <Link
                    key={n.id}
                    to={n.link ?? "/dashboard"}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-border/60 px-4 py-3 hover:bg-accent ${!n.read ? "bg-accent/30" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{n.title}</p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-accent"
            >
              Open dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

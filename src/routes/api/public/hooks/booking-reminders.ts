import { createFileRoute } from "@tanstack/react-router";

// Cron-triggered endpoint: for every booking with travel_date matching a user's
// configured reminder_days interval, insert a notification row (idempotent via dedupe_key).
export const Route = createFileRoute("/api/public/hooks/booking-reminders")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const today = new Date();
        const isoToday = today.toISOString().slice(0, 10);

        // Pull all future bookings within the next 60 days
        const horizon = new Date(today.getTime() + 60 * 86400000).toISOString().slice(0, 10);
        const { data: bookings, error: bErr } = await supabaseAdmin
          .from("bookings")
          .select("id, user_id, tour_place, country, travel_date, full_name, travelers")
          .gte("travel_date", isoToday)
          .lte("travel_date", horizon);
        if (bErr) return Response.json({ error: bErr.message }, { status: 500 });

        if (!bookings || bookings.length === 0) {
          return Response.json({ ok: true, created: 0 });
        }

        // Group user_ids and fetch prefs
        const userIds = Array.from(new Set(bookings.map((b) => b.user_id)));
        const { data: prefsRows } = await supabaseAdmin
          .from("notification_preferences")
          .select("user_id, in_app_enabled, reminder_days")
          .in("user_id", userIds);

        const prefsByUser = new Map<string, { in_app_enabled: boolean; reminder_days: number[] }>();
        for (const p of prefsRows ?? []) {
          prefsByUser.set(p.user_id, {
            in_app_enabled: p.in_app_enabled,
            reminder_days: p.reminder_days ?? [7, 1],
          });
        }

        const inserts: Array<{
          user_id: string;
          booking_id: string;
          title: string;
          body: string;
          link: string;
          kind: string;
          dedupe_key: string;
        }> = [];

        for (const b of bookings) {
          const prefs = prefsByUser.get(b.user_id) ?? { in_app_enabled: true, reminder_days: [7, 1] };
          if (!prefs.in_app_enabled) continue;

          const travel = new Date(b.travel_date + "T00:00:00Z");
          const todayUTC = new Date(isoToday + "T00:00:00Z");
          const daysAway = Math.round((travel.getTime() - todayUTC.getTime()) / 86400000);

          if (!prefs.reminder_days.includes(daysAway)) continue;

          const label =
            daysAway === 0
              ? "Today is travel day"
              : daysAway === 1
                ? "Your trip is tomorrow"
                : `Your trip is in ${daysAway} days`;
          inserts.push({
            user_id: b.user_id,
            booking_id: b.id,
            title: `${label}: ${b.tour_place}`,
            body: `Booking for ${b.full_name} (${b.travelers} traveler${b.travelers > 1 ? "s" : ""}) on ${b.travel_date}${b.country ? `, ${b.country}` : ""}.`,
            link: "/dashboard",
            kind: "reminder",
            dedupe_key: `reminder:${b.id}:${daysAway}`,
          });
        }

        if (inserts.length === 0) return Response.json({ ok: true, created: 0 });

        // Use upsert on (user_id, dedupe_key) so a re-run does not duplicate
        const { error: insErr, count } = await supabaseAdmin
          .from("notifications")
          .upsert(inserts, { onConflict: "user_id,dedupe_key", ignoreDuplicates: true, count: "exact" });
        if (insErr) return Response.json({ error: insErr.message }, { status: 500 });

        return Response.json({ ok: true, created: count ?? inserts.length });
      },
    },
  },
});

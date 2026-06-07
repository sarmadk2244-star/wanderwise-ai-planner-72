import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const BookingInputSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  cnic: z
    .string()
    .trim()
    .min(5)
    .max(20)
    .regex(/^[0-9-]+$/, "CNIC must contain digits and dashes only"),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^[+0-9 \-()]+$/, "Invalid phone number"),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  tour_place: z.string().trim().min(2).max(200),
  country: z.string().trim().max(120).optional().or(z.literal("")),
  travel_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  travelers: z.number().int().min(1).max(50),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .order("travel_date", { ascending: true });
    if (error) throw new Error(error.message);
    return { bookings: data ?? [] };
  });

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => BookingInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("bookings")
      .insert({
        user_id: context.userId,
        full_name: data.full_name,
        cnic: data.cnic,
        phone: data.phone,
        email: data.email || null,
        tour_place: data.tour_place,
        country: data.country || null,
        travel_date: data.travel_date,
        travelers: data.travelers,
        notes: data.notes || null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { booking: row };
  });

export const deleteBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("bookings").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

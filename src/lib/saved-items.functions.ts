import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ItemSchema = z.object({
  item_key: z.string().min(1).max(256),
  type: z.enum(["hotel", "flight", "transport", "destination"]),
  title: z.string().min(1).max(500),
  subtitle: z.string().max(1000).optional().nullable(),
  url: z.string().url().max(2000).optional().nullable(),
  image: z.string().max(2000).optional().nullable(),
  meta: z.record(z.string(), z.any()).optional(),
});

export const listSavedItems = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("saved_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

export const upsertSavedItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ItemSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_items")
      .upsert(
        {
          user_id: context.userId,
          item_key: data.item_key,
          type: data.type,
          title: data.title,
          subtitle: data.subtitle ?? null,
          url: data.url ?? null,
          image: data.image ?? null,
          meta: data.meta ?? {},
        },
        { onConflict: "user_id,item_key" }
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSavedItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ item_key: z.string().min(1).max(256) }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_items")
      .delete()
      .eq("item_key", data.item_key);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const bulkUpsertSavedItems = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ items: z.array(ItemSchema).max(500) }).parse(input)
  )
  .handler(async ({ data, context }) => {
    if (data.items.length === 0) return { ok: true, count: 0 };
    const rows = data.items.map((i) => ({
      user_id: context.userId,
      item_key: i.item_key,
      type: i.type,
      title: i.title,
      subtitle: i.subtitle ?? null,
      url: i.url ?? null,
      image: i.image ?? null,
      meta: i.meta ?? {},
    }));
    const { error } = await context.supabase
      .from("saved_items")
      .upsert(rows, { onConflict: "user_id,item_key" });
    if (error) throw new Error(error.message);
    return { ok: true, count: rows.length };
  });

export const clearSavedItems = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("saved_items")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

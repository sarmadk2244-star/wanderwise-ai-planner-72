import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  listSavedItems,
  upsertSavedItem,
  deleteSavedItem,
  bulkUpsertSavedItems,
  clearSavedItems,
} from "@/lib/saved-items.functions";

export type SavedItem = {
  id: string;            // item_key
  type: "hotel" | "flight" | "transport" | "destination";
  title: string;
  subtitle?: string;
  url?: string;
  image?: string;
  meta?: Record<string, string | number>;
  savedAt: number;
};

const KEY = "wayfarer:saved";

function readLocal(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeLocal(items: SavedItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("wayfarer:saved-change"));
}

function rowToItem(r: {
  item_key: string;
  type: string;
  title: string;
  subtitle: string | null;
  url: string | null;
  image: string | null;
  meta: unknown;
  created_at: string;
}): SavedItem {
  return {
    id: r.item_key,
    type: r.type as SavedItem["type"],
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    url: r.url ?? undefined,
    image: r.image ?? undefined,
    meta: (r.meta as Record<string, string | number>) ?? undefined,
    savedAt: new Date(r.created_at).getTime(),
  };
}

function itemToInput(i: SavedItem) {
  return {
    item_key: i.id,
    type: i.type,
    title: i.title,
    subtitle: i.subtitle,
    url: i.url,
    image: i.image,
    meta: i.meta,
  };
}

export function useSaved() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const mergedRef = useRef(false);

  // Track auth state
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUserId(data.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setUserId(session?.user?.id ?? null);
      if (event === "SIGNED_OUT") mergedRef.current = false;
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Initial load + sync when auth changes
  useEffect(() => {
    let active = true;
    setItems(readLocal());

    const refreshLocal = () => active && setItems(readLocal());
    window.addEventListener("wayfarer:saved-change", refreshLocal);
    window.addEventListener("storage", refreshLocal);

    if (userId) {
      (async () => {
        try {
          // One-time merge of local-only items into cloud on first sign-in
          const local = readLocal();
          if (!mergedRef.current && local.length > 0) {
            await bulkUpsertSavedItems({ data: { items: local.map(itemToInput) } });
            mergedRef.current = true;
          }
          const res = await listSavedItems();
          if (!active) return;
          const cloud = res.items.map(rowToItem);
          writeLocal(cloud);
        } catch (err) {
          console.warn("Cloud sync failed; using local copy", err);
        }
      })();
    }

    return () => {
      active = false;
      window.removeEventListener("wayfarer:saved-change", refreshLocal);
      window.removeEventListener("storage", refreshLocal);
    };
  }, [userId]);

  const save = useCallback(
    async (item: Omit<SavedItem, "savedAt">) => {
      const current = readLocal();
      if (current.some((x) => x.id === item.id)) return;
      const full: SavedItem = { ...item, savedAt: Date.now() };
      writeLocal([full, ...current]);
      if (userId) {
        try {
          await upsertSavedItem({ data: itemToInput(full) });
        } catch (err) {
          console.warn("Cloud save failed", err);
        }
      }
    },
    [userId]
  );

  const remove = useCallback(
    async (id: string) => {
      writeLocal(readLocal().filter((x) => x.id !== id));
      if (userId) {
        try {
          await deleteSavedItem({ data: { item_key: id } });
        } catch (err) {
          console.warn("Cloud delete failed", err);
        }
      }
    },
    [userId]
  );

  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);

  const clear = useCallback(async () => {
    writeLocal([]);
    if (userId) {
      try {
        await clearSavedItems();
      } catch (err) {
        console.warn("Cloud clear failed", err);
      }
    }
  }, [userId]);

  return { items, save, remove, has, clear, isSynced: !!userId };
}

// --- Booking URL helpers (external partners, deep links) ---
const enc = encodeURIComponent;

export const bookingLinks = {
  hotels: (city: string, country?: string) =>
    `https://www.booking.com/searchresults.html?ss=${enc(`${city}${country ? ", " + country : ""}`)}`,
  flights: (destCity: string, destCountry?: string) =>
    `https://www.google.com/travel/flights?q=${enc(`Flights to ${destCity}${destCountry ? ", " + destCountry : ""}`)}`,
  skyscanner: (destCity: string) =>
    `https://www.skyscanner.net/transport/flights-to/${enc(destCity.toLowerCase().replace(/\s+/g, "-"))}/`,
  transport: (from: string, to: string) =>
    `https://www.rome2rio.com/map/${enc(from)}/${enc(to)}`,
  airbnb: (city: string) =>
    `https://www.airbnb.com/s/${enc(city)}/homes`,
  tours: (city: string) =>
    `https://www.viator.com/searchResults/all?text=${enc(city)}`,
};

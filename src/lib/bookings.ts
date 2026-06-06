import { useEffect, useState, useCallback } from "react";

export type SavedItem = {
  id: string;            // unique key
  type: "hotel" | "flight" | "transport" | "destination";
  title: string;
  subtitle?: string;
  url?: string;          // external booking URL
  image?: string;
  meta?: Record<string, string | number>;
  savedAt: number;
};

const KEY = "wayfarer:saved";

function read(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: SavedItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("wayfarer:saved-change"));
}

export function useSaved() {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    setItems(read());
    const refresh = () => setItems(read());
    window.addEventListener("wayfarer:saved-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("wayfarer:saved-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const save = useCallback((item: Omit<SavedItem, "savedAt">) => {
    const current = read();
    if (current.some((x) => x.id === item.id)) return;
    write([{ ...item, savedAt: Date.now() }, ...current]);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((x) => x.id !== id));
  }, []);

  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);

  const clear = useCallback(() => write([]), []);

  return { items, save, remove, has, clear };
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

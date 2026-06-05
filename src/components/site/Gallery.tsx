import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from "lucide-react";

type Props = { images: string[]; alt: string };

export function Gallery({ images, alt }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);

  const close = useCallback(() => { setOpen(null); setZoom(false); }, []);
  const prev = useCallback(() => {
    setZoom(false);
    setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setZoom(false);
    setOpen((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-card"
          >
            <img
              src={src}
              alt={`${alt} — image ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-fade-up"
          onClick={close}
        >
          <button
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setZoom((z) => !z); }}
            aria-label="Zoom"
            className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
            {open + 1} / {images.length}
          </div>

          <div
            className="relative max-h-full max-w-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[open]}
              alt={`${alt} — image ${open + 1}`}
              className={`mx-auto max-h-[90vh] cursor-zoom-in rounded-xl object-contain transition-transform duration-300 ${zoom ? "scale-150 cursor-zoom-out" : ""}`}
              onClick={() => setZoom((z) => !z)}
            />
          </div>
        </div>
      )}
    </>
  );
}

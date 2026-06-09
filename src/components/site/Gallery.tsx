import { useEffect, useState, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Maximize2, Download } from "lucide-react";

type Props = { images: string[]; alt: string };

export function Gallery({ images, alt }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (open === null || !thumbStripRef.current) return;
    const active = thumbStripRef.current.querySelector<HTMLElement>(`[data-thumb="${open}"]`);
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [open]);

  if (images.length === 0) return null;

  const featured = images[0];
  const rest = images.slice(1);

  return (
    <>
      {/* Featured + grid layout */}
      <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2 md:h-[520px]">
        {/* Featured large tile */}
        <button
          onClick={() => setOpen(0)}
          className="group relative col-span-1 row-span-1 md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto overflow-hidden rounded-2xl bg-muted shadow-card"
        >
          <img
            src={featured}
            alt={`${alt} — featured`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            View gallery
          </span>
        </button>

        {/* Remaining tiles */}
        {rest.slice(0, 4).map((src, i) => {
          const idx = i + 1;
          const isLastVisible = i === 3 && rest.length > 4;
          return (
            <button
              key={src + idx}
              onClick={() => setOpen(idx)}
              className="group relative aspect-[4/3] md:aspect-auto overflow-hidden rounded-2xl bg-muted shadow-card"
            >
              <img
                src={src}
                alt={`${alt} — image ${idx + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {isLastVisible ? (
                <span className="absolute inset-0 grid place-items-center bg-black/55 text-white">
                  <span className="text-center">
                    <div className="font-display text-3xl">+{images.length - 5}</div>
                    <div className="text-xs uppercase tracking-widest">more photos</div>
                  </span>
                </span>
              ) : (
                <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 animate-fade-up"
          onClick={close}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-medium">
              <span className="text-white/60">Photo</span> {open + 1}
              <span className="text-white/60"> / {images.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={images[open]}
                target="_blank"
                rel="noreferrer"
                aria-label="Open original"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </a>
              <button
                onClick={() => setZoom((z) => !z)}
                aria-label="Zoom"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={close}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image area */}
          <div className="relative flex flex-1 items-center justify-center px-4" onClick={close}>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:left-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next"
              className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 md:right-8"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="relative max-h-full max-w-full overflow-auto" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[open]}
                alt={`${alt} — image ${open + 1}`}
                className={`mx-auto max-h-[70vh] cursor-zoom-in rounded-xl object-contain transition-transform duration-300 ${zoom ? "scale-150 cursor-zoom-out" : ""}`}
                onClick={() => setZoom((z) => !z)}
              />
            </div>
          </div>

          {/* Thumbnail strip */}
          <div
            className="border-t border-white/10 bg-black/60 px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={thumbStripRef}
              className="mx-auto flex max-w-5xl gap-2 overflow-x-auto scrollbar-thin"
            >
              {images.map((src, i) => (
                <button
                  key={src + i}
                  data-thumb={i}
                  onClick={() => { setOpen(i); setZoom(false); }}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    i === open ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

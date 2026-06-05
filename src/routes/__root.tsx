import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gradient-sunset">404</h1>
        <h2 className="mt-4 font-display text-3xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This path isn't on our map yet. Let's get you home.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-full bg-gradient-sunset px-5 py-2.5 text-sm text-primary-foreground shadow-glow">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Something went sideways</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again, or head back to the homepage.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-gradient-sunset px-5 py-2.5 text-sm text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Wayfarer — AI Trip Planner for Pakistan & Beyond" },
      { name: "description", content: "Plan unforgettable trips across Pakistan and international destinations with an AI travel concierge. Hotels, itineraries, and local tips." },
      { property: "og:title", content: "Wayfarer — AI Trip Planner for Pakistan & Beyond" },
      { property: "og:description", content: "Plan unforgettable trips across Pakistan and international destinations with an AI travel concierge. Hotels, itineraries, and local tips." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Wayfarer — AI Trip Planner for Pakistan & Beyond" },
      { name: "twitter:description", content: "Plan unforgettable trips across Pakistan and international destinations with an AI travel concierge. Hotels, itineraries, and local tips." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a93ca427-86b8-43ab-baf6-5d461f006af2/id-preview-06767b83--889768dd-4ffa-4bdc-9fdf-ee3557ef2cd6.lovable.app-1779625612554.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a93ca427-86b8-43ab-baf6-5d461f006af2/id-preview-06767b83--889768dd-4ffa-4bdc-9fdf-ee3557ef2cd6.lovable.app-1779625612554.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Database, Cookie, Mail, FileText, UserCheck, Server } from "lucide-react";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust & Privacy · Wayfarer" },
      {
        name: "description",
        content:
          "How Wayfarer handles your data, security, privacy, and the platform controls that protect your account.",
      },
      { property: "og:title", content: "Trust & Privacy · Wayfarer" },
      {
        property: "og:description",
        content:
          "Wayfarer's approach to account security, data handling, subprocessors, cookies, and privacy requests.",
      },
    ],
  }),
  component: TrustPage,
});

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-aurora text-white">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-display text-xl">{title}</h2>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function TrustPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" /> Trust Center
        </span>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">Trust & Privacy</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          This page is maintained by the Wayfarer team to answer common security and
          privacy questions about the app. It describes practices and platform
          controls that are currently in place — it is not an independent
          certification.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Section icon={UserCheck} title="Accounts & access">
          <p>
            Sign-in is handled by our managed authentication backend. Passwords are
            never stored in plaintext, and sessions use industry-standard bearer
            tokens scoped to your browser.
          </p>
          <p>
            Administrative actions inside the app are gated by a server-side role
            check. Only users explicitly granted an admin role can view or modify
            bookings, support messages, and other users' data.
          </p>
        </Section>

        <Section icon={Lock} title="Data protection">
          <p>
            Traffic between your browser and Wayfarer is encrypted in transit using
            HTTPS. Data at rest is stored in our managed database with platform-level
            encryption provided by the hosting provider.
          </p>
          <p>
            Each table that holds user data has row-level access rules so signed-in
            users can only read and modify their own bookings, saved items, and
            notifications.
          </p>
        </Section>

        <Section icon={Database} title="What we collect">
          <p>
            Account: email address and authentication metadata. Bookings: name,
            contact details, CNIC/ID, travel preferences you submit on the booking
            form. Saved items and AI planner inputs you create while signed in.
          </p>
          <p>
            We do not sell personal data. We use submitted information only to
            deliver the trip-planning, booking, and support features of the app.
          </p>
        </Section>

        <Section icon={Server} title="Subprocessors & hosting">
          <p>
            Wayfarer runs on a managed serverless platform and uses a managed
            Postgres database for storage and authentication. AI suggestions are
            generated through a hosted AI gateway. These providers process data on
            our behalf strictly to operate the service.
          </p>
          <p>
            If you need an up-to-date list of subprocessors for compliance review,
            contact us using the address below.
          </p>
        </Section>

        <Section icon={Cookie} title="Cookies & analytics">
          <p>
            We use cookies and similar local storage strictly to keep you signed in
            and to remember your theme and UI preferences. The app does not embed
            third-party advertising trackers.
          </p>
        </Section>

        <Section icon={FileText} title="Retention & deletion">
          <p>
            Your bookings, saved items, and account data are retained while your
            account is active. To request deletion of your account or specific
            records, reach out via the contact form and we will action the request.
          </p>
        </Section>

        <Section icon={Shield} title="Reporting a vulnerability">
          <p>
            If you believe you've found a security issue, please report it privately
            using the contact form rather than disclosing it publicly. We will
            acknowledge legitimate reports and work in good faith on a fix.
          </p>
        </Section>

        <Section icon={Mail} title="Contact">
          <p>
            Security, privacy, or data questions? Use the{" "}
            <Link to="/contact" className="underline">
              contact page
            </Link>{" "}
            and pick a clear subject line such as "Privacy request" or "Security
            report" so we can route it correctly.
          </p>
        </Section>
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        This page describes current app-level practices and may be updated as the
        product evolves. It is not a legal contract or a third-party audit report.
      </p>
    </main>
  );
}

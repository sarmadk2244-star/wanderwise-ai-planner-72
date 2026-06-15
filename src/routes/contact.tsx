import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { submitContactMessage } from "@/lib/contact.functions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us — Wayfarer" },
      { name: "description", content: "Get in touch with the Wayfarer team. Ask about trips, bookings, or partnerships." },
    ],
  }),
});

function ContactPage() {
  const fn = useServerFn(submitContactMessage);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const mut = useMutation({
    mutationFn: () => fn({ data: form }),
    onSuccess: () => {
      toast.success("Message sent — we'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const valid =
    form.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.subject.trim().length >= 2 &&
    form.message.trim().length >= 5;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <span className="inline-grid h-12 w-12 place-items-center rounded-full bg-gradient-sunset text-white shadow-glow">
          <Mail className="h-5 w-5" />
        </span>
        <h1 className="mt-4 font-display text-4xl">Contact us</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions about a destination, booking, or partnership? Drop us a line.
        </p>
      </div>

      <div className="glass mt-8 space-y-4 rounded-3xl p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Your name</Label>
            <Input value={form.name} maxLength={120} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} maxLength={255} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Subject</Label>
          <Input value={form.subject} maxLength={200} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea rows={6} value={form.message} maxLength={4000} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <Button
          className="w-full rounded-full bg-gradient-sunset text-primary-foreground shadow-glow"
          onClick={() => mut.mutate()}
          disabled={!valid || mut.isPending}
        >
          <Send className="mr-2 h-4 w-4" />
          {mut.isPending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </div>
  );
}

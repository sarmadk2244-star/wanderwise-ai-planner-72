import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminListContactMessages,
  adminReplyContactMessage,
  adminUpdateContactStatus,
} from "@/lib/contact.functions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquareReply, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({ component: AdminMessages });

function AdminMessages() {
  const listFn = useServerFn(adminListContactMessages);
  const replyFn = useServerFn(adminReplyContactMessage);
  const statusFn = useServerFn(adminUpdateContactStatus);
  const qc = useQueryClient();
  const [replies, setReplies] = useState<Record<string, string>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "contact"],
    queryFn: () => listFn(),
  });

  const replyMut = useMutation({
    mutationFn: (vars: { id: string; reply: string }) => replyFn({ data: vars }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "contact"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      setReplies((r) => ({ ...r, [vars.id]: "" }));
      toast.success("Reply sent");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const closeMut = useMutation({
    mutationFn: (id: string) => statusFn({ data: { id, status: "closed" } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "contact"] }),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading messages…</div>;
  if (error) return <div className="text-sm text-destructive">{(error as Error).message}</div>;

  const messages = data?.messages ?? [];

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl">Support Inbox</h2>
      {messages.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
          No messages yet. Submissions from the Contact page show up here.
        </div>
      )}
      {messages.map((m: any) => {
        const statusColor =
          m.status === "open" ? "bg-amber-500" : m.status === "replied" ? "bg-emerald-500" : "bg-muted";
        return (
          <div key={m.id} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{m.subject}</h3>
                  <Badge className={`${statusColor} text-white capitalize`}>{m.status}</Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{m.name} · {m.email}</span>
                  <span>· {new Date(m.created_at).toLocaleString()}</span>
                </div>
              </div>
              {m.status !== "closed" && (
                <Button size="sm" variant="ghost" onClick={() => closeMut.mutate(m.id)}>
                  <CheckCheck className="mr-1 h-4 w-4" /> Close
                </Button>
              )}
            </div>

            <p className="mt-3 whitespace-pre-wrap rounded-xl bg-card/40 p-3 text-sm">{m.message}</p>

            {m.admin_reply && (
              <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
                <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                  Your reply — {m.replied_at ? new Date(m.replied_at).toLocaleString() : ""}
                </div>
                <p className="whitespace-pre-wrap">{m.admin_reply}</p>
              </div>
            )}

            {m.status !== "closed" && (
              <div className="mt-3 space-y-2">
                <Textarea
                  rows={3}
                  placeholder={m.admin_reply ? "Send another reply…" : "Write a reply to the user…"}
                  value={replies[m.id] ?? ""}
                  onChange={(e) => setReplies((r) => ({ ...r, [m.id]: e.target.value }))}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const reply = (replies[m.id] ?? "").trim();
                    if (!reply) return toast.error("Reply cannot be empty");
                    replyMut.mutate({ id: m.id, reply });
                  }}
                  disabled={replyMut.isPending}
                >
                  <MessageSquareReply className="mr-1 h-4 w-4" />
                  {replyMut.isPending ? "Sending…" : "Send reply"}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

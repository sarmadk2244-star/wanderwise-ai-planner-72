import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminListUsers, adminSendNotification } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/send")({ component: AdminSend });

function AdminSend() {
  const listFn = useServerFn(adminListUsers);
  const sendFn = useServerFn(adminSendNotification);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");

  const { data } = useQuery({ queryKey: ["admin", "users"], queryFn: () => listFn() });
  const users = data?.users ?? [];

  const mut = useMutation({
    mutationFn: () => sendFn({ data: { user_id: userId, title, body, link } }),
    onSuccess: () => {
      toast.success("Message sent — appears in user's notifications");
      setTitle("");
      setBody("");
      setLink("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl">Send Message to User</h2>
      <p className="text-sm text-muted-foreground">
        Delivers an in-app notification to the selected user (visible in their bell icon).
      </p>
      <div className="glass space-y-4 rounded-2xl p-6">
        <div className="space-y-2">
          <Label>Recipient</Label>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger><SelectValue placeholder="Choose a user…" /></SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.email ?? u.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} placeholder="Heads up about your trip" />
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea rows={5} value={body} maxLength={2000} onChange={(e) => setBody(e.target.value)} placeholder="Write your message…" />
        </div>
        <div className="space-y-2">
          <Label>Link (optional)</Label>
          <Input value={link} maxLength={500} onChange={(e) => setLink(e.target.value)} placeholder="/dashboard" />
        </div>
        <Button
          onClick={() => mut.mutate()}
          disabled={!userId || !title.trim() || !body.trim() || mut.isPending}
        >
          <Send className="mr-2 h-4 w-4" />
          {mut.isPending ? "Sending…" : "Send notification"}
        </Button>
      </div>
    </div>
  );
}

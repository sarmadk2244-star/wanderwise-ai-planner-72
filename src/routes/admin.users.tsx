import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListUsers, adminSetUserRole } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  const listFn = useServerFn(adminListUsers);
  const roleFn = useServerFn(adminSetUserRole);
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => listFn(),
  });

  const roleMut = useMutation({
    mutationFn: (vars: { user_id: string; role: "admin"; grant: boolean }) =>
      roleFn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading users…</div>;
  if (error) return <div className="text-sm text-destructive">{(error as Error).message}</div>;

  const users = (data?.users ?? []).filter((u) =>
    !q ? true : (u.email ?? "").toLowerCase().includes(q.toLowerCase()) || u.id.includes(q)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-2xl">Users</h2>
        <Input placeholder="Search by email or id…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Last Sign In</th>
              <th className="p-3">Roles</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isAdmin = u.roles.includes("admin");
              return (
                <tr key={u.id} className="border-b border-border/30 last:border-0">
                  <td className="p-3">
                    <div className="font-medium">{u.email ?? "—"}</div>
                    <div className="text-[10px] text-muted-foreground">{u.id}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"}
                  </td>
                  <td className="p-3">
                    {u.roles.length === 0 ? (
                      <span className="text-xs text-muted-foreground">user</span>
                    ) : (
                      u.roles.map((r) => (
                        <Badge key={r} variant="secondary" className="mr-1 capitalize">{r}</Badge>
                      ))
                    )}
                  </td>
                  <td className="p-3">
                    {isAdmin ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => roleMut.mutate({ user_id: u.id, role: "admin", grant: false })}
                        disabled={roleMut.isPending}
                      >
                        <ShieldOff className="mr-1 h-4 w-4" /> Revoke admin
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => roleMut.mutate({ user_id: u.id, role: "admin", grant: true })}
                        disabled={roleMut.isPending}
                      >
                        <Shield className="mr-1 h-4 w-4" /> Make admin
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListBookings, adminUpdateBookingStatus, adminDeleteBooking } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/bookings")({ component: AdminBookings });

const STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

function AdminBookings() {
  const listFn = useServerFn(adminListBookings);
  const updateFn = useServerFn(adminUpdateBookingStatus);
  const deleteFn = useServerFn(adminDeleteBooking);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () => listFn(),
  });

  const updateMut = useMutation({
    mutationFn: (vars: { id: string; status: (typeof STATUSES)[number] }) =>
      updateFn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Status updated — user notified");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success("Booking deleted");
      setPendingDelete(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading bookings…</div>;
  if (error) return <div className="text-sm text-destructive">{(error as Error).message}</div>;

  const bookings = data?.bookings ?? [];
  const filtered = filter === "all" ? bookings : bookings.filter((b: any) => b.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-2xl">All Bookings</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({bookings.length})</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Destination</th>
              <th className="p-3">Date</th>
              <th className="p-3">Travelers</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No bookings.</td></tr>
            )}
            {filtered.map((b: any) => (
              <tr key={b.id} className="border-b border-border/30 last:border-0">
                <td className="p-3">
                  <div className="font-medium">{b.full_name}</div>
                  <div className="text-xs text-muted-foreground">{b.cnic}</div>
                </td>
                <td className="p-3">
                  {b.tour_place}
                  {b.country && <div className="text-xs text-muted-foreground">{b.country}</div>}
                </td>
                <td className="p-3 whitespace-nowrap">{b.travel_date}</td>
                <td className="p-3">{b.travelers}</td>
                <td className="p-3 text-xs">
                  <div>{b.phone}</div>
                  {b.email && <div className="text-muted-foreground">{b.email}</div>}
                </td>
                <td className="p-3">
                  <Select
                    value={b.status}
                    onValueChange={(v) => updateMut.mutate({ id: b.id, status: v as any })}
                  >
                    <SelectTrigger className="h-8 w-36 capitalize"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  <Button size="icon" variant="ghost" onClick={() => setPendingDelete(b.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingDelete && deleteMut.mutate(pendingDelete)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

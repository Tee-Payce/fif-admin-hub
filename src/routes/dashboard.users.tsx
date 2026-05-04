import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/store";
import { Users as UsersIcon } from "lucide-react";
import { TableSkeleton, EmptyState, PageStatusBadge } from "@/components/StateIndicators";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/users")({
  head: () => ({ meta: [{ title: "Users — FIF Admin" }] }),
  component: UsersPage,
});

const TIER_COLORS: Record<string, string> = {
  free: "bg-muted text-foreground",
  standard: "bg-primary/10 text-primary",
  premium: "bg-primary/20 text-primary border border-primary/20",
  vvip: "bg-gold/20 text-foreground border border-gold/40",
};

function UsersPage() {
  const { users, fetchUsers, updateUserStatus, loading } = useData();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateUserStatus(userId, { role });
      toast.success("User role updated");
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleTierChange = async (userId: string, subscriptionTier: string) => {
    try {
      await updateUserStatus(userId, { subscriptionTier });
      toast.success("Subscription tier updated");
    } catch (error) {
      toast.error("Failed to update subscription tier");
    }
  };

  const handleActiveToggle = async (userId: string, isActive: boolean) => {
    try {
      await updateUserStatus(userId, { isActive });
      toast.success(isActive ? "User activated" : "User deactivated");
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">{users.length} total members</p>
        </div>
        <PageStatusBadge loading={loading} count={users.length} unit="users" />
      </div>
      {loading && users.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <TableSkeleton rows={6} cols={5} />
        </div>
      ) : users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users yet" description="Members will appear here once they sign up." />
      ) : (
      <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => {
              const initials = u.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("");
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v)}>
                      <SelectTrigger className="w-40 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general_user">Member</SelectItem>
                        <SelectItem value="library_admin">Library Admin</SelectItem>
                        <SelectItem value="posts_admin">Posts Admin</SelectItem>
                        <SelectItem value="system_admin">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${TIER_COLORS[u.subscriptionTier.toLowerCase()]}`}>
                        {u.subscriptionTier}
                      </span>
                      <Select value={u.subscriptionTier} onValueChange={(v) => handleTierChange(u.id, v)}>
                        <SelectTrigger className="w-32 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vvip">VVIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Switch checked={u.isActive} onCheckedChange={(v) => handleActiveToggle(u.id, v)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      )}
    </div>
  );
}

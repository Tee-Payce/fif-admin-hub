import { createFileRoute } from "@tanstack/react-router";
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
import type { Tier, User } from "@/data/mock";

export const Route = createFileRoute("/dashboard/users")({
  head: () => ({ meta: [{ title: "Users — FIF Admin" }] }),
  component: UsersPage,
});

const TIER_COLORS: Record<Tier, string> = {
  Standard: "bg-muted text-foreground",
  Premium: "bg-primary/10 text-primary",
  VVIP: "bg-gold/20 text-foreground border border-gold/40",
};

function UsersPage() {
  const { users, setUserRole, setUserTier, toggleUserActive } = useData();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">{users.length} total members</p>
      </div>
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
            {users.map((u) => {
              const initials = u.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
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
                    <Select value={u.role} onValueChange={(v) => setUserRole(u.id, v as User["role"])}>
                      <SelectTrigger className="w-40 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="library_admin">Library Admin</SelectItem>
                        <SelectItem value="posts_admin">Posts Admin</SelectItem>
                        <SelectItem value="system_admin">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TIER_COLORS[u.tier]}`}>
                        {u.tier}
                      </span>
                      <Select value={u.tier} onValueChange={(v) => setUserTier(u.id, v as Tier)}>
                        <SelectTrigger className="w-32 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="VVIP">VVIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                  <TableCell>
                    <Switch checked={u.active} onCheckedChange={() => toggleUserActive(u.id)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

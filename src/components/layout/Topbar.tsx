import { Bell, LogOut, Search } from "lucide-react";
import { useAuth } from "@/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/data/mock";

const ROLE_LABEL: Record<Role, string> = {
  system_admin: "System Admin",
  posts_admin: "Posts Admin",
  library_admin: "Library Admin",
};

export function Topbar() {
  const { currentUser, currentRole, setRole } = useAuth();
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
      <div className="h-full px-4 md:px-8 flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search users, books, sermons…"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex-1 md:hidden font-semibold">FIF Admin</div>

        <Badge variant="outline" className="hidden sm:inline-flex border-gold/40 text-foreground bg-gold/10">
          {ROLE_LABEL[currentRole]}
        </Badge>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:bg-muted px-1 py-1 transition">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="font-semibold">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground font-normal">{currentUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch role (demo)
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={currentRole}
              onValueChange={(v) => setRole(v as Role)}
            >
              <DropdownMenuRadioItem value="system_admin">System Admin</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="posts_admin">Posts Admin</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="library_admin">Library Admin</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

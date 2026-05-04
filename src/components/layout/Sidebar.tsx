import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Megaphone,
  Library,
  Users,
  CreditCard,
  Settings,
  MessageSquare,
} from "lucide-react";
import { useAuth, ROLE_ACCESS } from "@/store";
import { cn } from "@/lib/utils";

const NAV = [
  { key: "overview", to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "posts", to: "/dashboard/posts", label: "Apostles Update", icon: Megaphone },
  { key: "library", to: "/dashboard/library", label: "Library", icon: Library },
  { key: "posts_moderation", to: "/dashboard/moderation", label: "Comments", icon: MessageSquare, params: { tab: "comments" } },
  { key: "library_moderation", to: "/dashboard/moderation", label: "Reviews", icon: MessageSquare, params: { tab: "reviews" } },
  { key: "users", to: "/dashboard/users", label: "Users", icon: Users },
  { key: "subscriptions", to: "/dashboard/subscriptions", label: "Subscriptions", icon: CreditCard },
  { key: "settings", to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const role = useAuth((s) => s.currentRole);
  const allowed = role ? ROLE_ACCESS[role] : [];
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-gold)" }}>
          <img src="/assets/fif-logo.png" className="h-10 w-10 object-contain" />
        </div>
        <div>
          <div className="font-bold tracking-tight">FIF App</div>
          <div className="text-xs text-sidebar-foreground/60">Admin Console</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.filter((n) => allowed.includes(n.key)).map((item) => {
          const active =
            pathname === item.to ||
            (item.to !== "/dashboard" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.to}
              search={item.params}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-sidebar-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 m-3 rounded-xl text-sm" style={{ background: "var(--gradient-primary)" }}>
        <div className="font-semibold text-primary-foreground">FIF Ministries</div>
        <div className="text-primary-foreground/80 text-xs mt-1">Empowering generations through faith.</div>
      </div>
    </aside>
  );
}

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  accent?: "primary" | "gold" | "success";
}

export function StatCard({ label, value, icon: Icon, trend, accent = "primary" }: StatCardProps) {
  const accentBg = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-foreground",
    success: "bg-success/10 text-success",
  }[accent];

  return (
    <div
      className="rounded-2xl bg-card border border-border p-5 transition-all hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {trend && <p className="mt-1 text-xs text-success font-medium">{trend}</p>}
        </div>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", accentBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

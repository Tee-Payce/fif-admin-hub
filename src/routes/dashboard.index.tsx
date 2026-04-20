import { createFileRoute } from "@tanstack/react-router";
import { Users, BookOpen, Video, Megaphone, CreditCard } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { useData } from "@/store";
import { userGrowth, subscriptionDistribution } from "@/data/mock";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "Overview — FIF App Admin" }],
  }),
  component: Overview,
});

const COLORS = ["oklch(0.32 0.18 295)", "oklch(0.78 0.14 85)", "oklch(0.55 0.22 295)"];

function Overview() {
  const { users, books, sermons, posts } = useData();
  const activeSubs = users.filter((u) => u.tier !== "Standard" && u.active).length;
  const liveStories = posts.filter((p) => Date.now() - p.createdAt < 24 * 60 * 60 * 1000).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div
        className="rounded-2xl p-6 md:p-8 text-primary-foreground"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-elegant)" }}
      >
        <p className="text-sm text-primary-foreground/80">Welcome back</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">FIF Ministries Dashboard</h1>
        <p className="text-primary-foreground/80 mt-2 max-w-xl">
          Manage apostles updates, library content, members and subscriptions — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={users.length.toLocaleString()} icon={Users} trend="+12% this month" />
        <StatCard label="Active Subs" value={activeSubs} icon={CreditCard} accent="gold" trend="+5%" />
        <StatCard label="Total Books" value={books.length} icon={BookOpen} />
        <StatCard label="Total Sermons" value={sermons.length} icon={Video} accent="success" />
        <StatCard label="Live Stories" value={liveStories} icon={Megaphone} accent="gold" trend="24h posts" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <h3 className="font-semibold">User Growth</h3>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.45 0.22 295)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.45 0.22 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 290)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0.03 290)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 290)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 290)" }} />
                <Area type="monotone" dataKey="users" stroke="oklch(0.32 0.18 295)" strokeWidth={2.5} fill="url(#ug)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-semibold">Subscription Mix</h3>
          <p className="text-sm text-muted-foreground mb-4">Distribution by plan</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionDistribution}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {subscriptionDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 290)" }} />
                <Legend verticalAlign="bottom" height={32} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

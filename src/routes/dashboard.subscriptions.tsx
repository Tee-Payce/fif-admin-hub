import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from "react";
import { Check, Crown, Save, Loader2, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/store";
import { toast } from "sonner";
import type { Tier } from "@/data/mock";

export const Route = createFileRoute("/dashboard/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions — FIF Admin" }] }),
  component: SubsPage,
});

const TIER_STYLES: Record<Tier, { bg: string; ring: string }> = {
  Standard: { bg: "bg-card", ring: "" },
  Premium: { bg: "bg-card", ring: "ring-2 ring-primary/30" },
  VVIP: { bg: "", ring: "ring-2 ring-gold" },
};

function SubsPage() {
  const { plans, updatePlanPrice, savePlanPrice, fetchPlans, fetchStats, stats, loading } = useData();
  const [chartView, setChartView] = useState<"count" | "amount">("count");

  useEffect(() => {
    fetchPlans();
    fetchStats();
  }, [fetchPlans, fetchStats]);

  const handleSave = async (id: Tier, price: number) => {
    const tid = toast.loading(`Updating ${id} price...`);
    try {
      await savePlanPrice(id, price);
      toast.success(`${id} price updated successfully!`, { id: tid });
    } catch (error) {
      toast.error("Failed to update price.", { id: tid });
    }
  };

  const totalSubscribers = stats?.subscriptionAnalytics?.reduce((acc: number, s: any) => acc + s.count, 0) || 0;
  const totalRevenue = stats?.subscriptionAnalytics?.reduce((acc: number, s: any) => acc + s.revenue, 0) || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage pricing and monitor growth.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Users className="h-4 w-4" />
            <span className="font-bold">{totalSubscribers.toLocaleString()}</span>
            <span className="text-xs opacity-70">Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-600 border border-green-500/20">
            <DollarSign className="h-4 w-4" />
            <span className="font-bold">${totalRevenue.toLocaleString()}</span>
            <span className="text-xs opacity-70">/mo MRR</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Section */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Subscription Trends</h3>
            </div>
            <Tabs value={chartView} onValueChange={(v: any) => setChartView(v)}>
              <TabsList className="grid grid-cols-2 h-8 w-40">
                <TabsTrigger value="count" className="text-xs">Volume</TabsTrigger>
                <TabsTrigger value="amount" className="text-xs">Revenue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === "count" ? (
                <BarChart data={stats?.subscriptionGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.01 290)" />
                  <XAxis dataKey="month" stroke="oklch(0.5 0.03 290)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.03 290)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-card)" }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="standard" name="Standard" stackId="a" fill="oklch(0.55 0.22 295)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="premium" name="Premium" stackId="a" fill="oklch(0.4 0.2 150)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="vvip" name="VVIP" stackId="a" fill="oklch(0.78 0.14 85)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={stats?.subscriptionGrowth}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.45 0.22 295)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.45 0.22 295)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.01 290)" />
                  <XAxis dataKey="month" stroke="oklch(0.5 0.03 290)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.03 290)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "var(--shadow-card)" }} formatter={(v) => `$${v}`} />
                  <Area type="monotone" dataKey="amount" name="Revenue" stroke="oklch(0.32 0.18 295)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Card */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-bold">Summary</h3>
          </div>
          <div className="flex-1 space-y-4">
            {stats?.subscriptionAnalytics?.map((s: any) => (
              <div key={s.tier} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold capitalize">{s.tier.toLowerCase()}</span>
                  <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    {((s.count / (totalSubscribers || 1)) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">{s.count}</span>
                    <span className="text-xs text-muted-foreground text-opacity-70">users</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-green-600">${s.revenue.toLocaleString()}</span>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">est. revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border">
             <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Monthly Potential</span>
                <span className="font-bold text-xl text-primary">${totalRevenue.toLocaleString()}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border border-border p-6 ${TIER_STYLES[plan.id].bg} ${TIER_STYLES[plan.id].ring} relative overflow-hidden`}
            style={{
              boxShadow: plan.id === "VVIP" ? "var(--shadow-gold)" : "var(--shadow-card)",
              ...(plan.id === "VVIP" ? { background: "var(--gradient-hero)" } : {}),
            }}
          >
            {plan.id === "VVIP" && (
              <div className="absolute top-3 right-3">
                <Crown className="h-5 w-5 text-gold" />
              </div>
            )}
            <div className={plan.id === "VVIP" ? "text-primary-foreground" : ""}>
              <h3 className="text-lg font-bold">{plan.id}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-sm opacity-70">/mo</span>
              </div>
              <div className={`mt-2 text-sm ${plan.id === "VVIP" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {plan.subscribers.toLocaleString()} subscribers
              </div>
              <ul className="mt-5 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`h-4 w-4 ${plan.id === "VVIP" ? "text-gold" : "text-primary"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-3">
                <div className="space-y-2">
                  <Label className={plan.id === "VVIP" ? "text-primary-foreground" : ""}>Set price ($)</Label>
                  <Input
                    type="number"
                    value={plan.price}
                    onChange={(e) => updatePlanPrice(plan.id, Number(e.target.value))}
                    className={plan.id === "VVIP" ? "bg-white/10 text-primary-foreground border-white/20" : ""}
                  />
                </div>
                <Button 
                  onClick={() => handleSave(plan.id, plan.price)}
                  disabled={loading}
                  className="w-full gap-2"
                  variant={plan.id === "VVIP" ? "secondary" : "default"}
                  style={plan.id !== "VVIP" ? { background: "var(--gradient-primary)" } : {}}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Price
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

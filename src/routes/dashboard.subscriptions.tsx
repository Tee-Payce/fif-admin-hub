import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useData } from "@/store";
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
  const { plans, updatePlanPrice } = useData();
  const total = plans.reduce((acc, p) => acc + p.subscribers, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground">{total.toLocaleString()} total subscribers across all plans.</p>
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
              <div className="mt-5 space-y-2">
                <Label className={plan.id === "VVIP" ? "text-primary-foreground" : ""}>Set price ($)</Label>
                <Input
                  type="number"
                  value={plan.price}
                  onChange={(e) => updatePlanPrice(plan.id, Number(e.target.value))}
                  className={plan.id === "VVIP" ? "bg-white/10 text-primary-foreground border-white/20" : ""}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

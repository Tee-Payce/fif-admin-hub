import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — FIF Admin" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { currentUser } = useAuth();
  const [appName, setAppName] = useState("FIF App");
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your app and admin profile.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-semibold">App Settings</h2>
        <div className="space-y-2">
          <Label>App Name</Label>
          <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-semibold">Theme Preview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Primary", bg: "var(--gradient-primary)", fg: "text-primary-foreground" },
            { label: "Gold", bg: "var(--gradient-gold)", fg: "text-gold-foreground" },
            { label: "Hero", bg: "var(--gradient-hero)", fg: "text-primary-foreground" },
            { label: "Background", bg: "var(--background)", fg: "text-foreground border border-border" },
          ].map((c) => (
            <div key={c.label} className={`h-24 rounded-xl flex items-end p-3 font-medium ${c.fg}`} style={{ background: c.bg }}>
              {c.label}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-semibold">Admin Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <Button style={{ background: "var(--gradient-primary)" }}>Save changes</Button>
      </div>
    </div>
  );
}

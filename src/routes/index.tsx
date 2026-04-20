import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, ArrowRight, Shield, Sparkles, Library } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FIF App — Admin Console" },
      { name: "description", content: "Admin dashboard for FIF Ministries." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--gradient-hero)" }}>
      <header className="px-6 md:px-10 py-6 flex items-center justify-between text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-gold)" }}>
            <Crown className="h-5 w-5" />
          </div>
          <div className="font-bold text-lg">FIF App</div>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur hover:bg-white/20 transition text-sm font-medium"
        >
          Open Admin <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-3xl text-center text-primary-foreground">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" /> FIF Ministries
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            The admin console for <span style={{ color: "oklch(0.85 0.16 90)" }}>modern ministry</span>
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Manage apostles updates, library content, members and subscriptions — all in one beautifully designed dashboard.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-primary font-semibold bg-white hover:bg-white/90 transition"
              style={{ boxShadow: "var(--shadow-gold)" }}
            >
              Enter Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: Shield, title: "Role-based", desc: "System, Posts & Library admin roles." },
              { icon: Library, title: "Library", desc: "Books and video sermons in one place." },
              { icon: Sparkles, title: "24h Stories", desc: "Apostles updates that auto-expire." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-5">
                <f.icon className="h-5 w-5 text-gold" />
                <div className="mt-3 font-semibold">{f.title}</div>
                <div className="text-sm text-primary-foreground/80 mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

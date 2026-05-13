"use client";

import Link from "next/link";
import { fmt, fmtRange } from "@/lib/utils";

interface Estimate {
  id: string;
  estimate_number?: string;
  status: string;
  tier: string;
  severity?: string;
  tier1_low?: number;
  tier1_high?: number;
  confidence?: number;
  created_at: string;
  vehicles?: { year?: number; make?: string; model?: string } | { year?: number; make?: string; model?: string }[] | null;
}

interface Vehicle {
  id: string;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
}

interface Stats {
  total: number;
  pending: number;
  ready: number;
  tier2: number;
}

interface Props {
  estimates: Estimate[];
  vehicles: Vehicle[];
  stats: Stats;
  userName: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--muted)",
  processing: "oklch(0.7 0.16 60)",
  ready: "var(--success)",
  error: "var(--danger)",
};

const SEV_COLORS: Record<string, string> = {
  Minor: "var(--info)",
  Moderate: "oklch(0.7 0.16 60)",
  Severe: "var(--danger)",
};

function getVehicle(v: Estimate["vehicles"]) {
  if (!v) return null;
  return Array.isArray(v) ? v[0] : v;
}

const KANBAN_COLS = [
  { key: "pending", label: "Pending", filter: (e: Estimate) => e.status === "pending" },
  { key: "processing", label: "Processing", filter: (e: Estimate) => e.status === "processing" },
  { key: "ready", label: "Ready", filter: (e: Estimate) => e.status === "ready" && e.tier === "tier1" },
  { key: "tier2", label: "Full Report", filter: (e: Estimate) => e.tier === "tier2" },
];

export function DashboardClient({ estimates, stats, userName }: Props) {
  const now = new Date();

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 4px" }}>Fleet Dashboard</h1>
          <p style={{ color: "var(--text-2)", fontSize: 14, margin: 0 }}>Welcome back, {userName.split(" ")[0]}</p>
        </div>
        <Link href="/estimate" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 18px", borderRadius: 10, border: "none", background: "var(--accent)", color: "white", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
          + New Estimate
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total estimates", value: stats.total, icon: "📋" },
          { label: "In progress", value: stats.pending, icon: "⏳" },
          { label: "Ready", value: stats.ready, icon: "✅" },
          { label: "Full reports", value: stats.tier2, icon: "📄" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Estimate pipeline</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 36 }}>
        {KANBAN_COLS.map(col => {
          const colEstimates = estimates.filter(col.filter);
          return (
            <div key={col.key} style={{ background: "var(--surface-2)", borderRadius: 10, padding: 12, minHeight: 120 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{col.label}</span>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 99, background: "var(--surface)", fontSize: 11, fontWeight: 600, color: "var(--muted)" }}>{colEstimates.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {colEstimates.slice(0, 5).map(e => (
                  <Link key={e.id} href={`/estimate/${e.id}`} style={{ display: "block", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", textDecoration: "none" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>
                      {e.estimate_number ?? e.id.slice(0, 8)}
                    </div>
                    {getVehicle(e.vehicles) && (
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        {getVehicle(e.vehicles)!.year} {getVehicle(e.vehicles)!.make} {getVehicle(e.vehicles)!.model}
                      </div>
                    )}
                    {e.tier1_low && e.tier1_high && (
                      <div style={{ fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--text-2)", marginTop: 4 }}>
                        {fmtRange(e.tier1_low, e.tier1_high)}
                      </div>
                    )}
                    {e.severity && (
                      <span style={{ display: "inline-block", marginTop: 4, padding: "1px 6px", borderRadius: 999, fontSize: 10, fontWeight: 600, background: `color-mix(in oklch, ${SEV_COLORS[e.severity] ?? "var(--muted)"} 15%, transparent)`, color: SEV_COLORS[e.severity] ?? "var(--muted)" }}>
                        {e.severity}
                      </span>
                    )}
                  </Link>
                ))}
                {colEstimates.length === 0 && (
                  <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", padding: "16px 0" }}>Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent estimates table */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>All estimates</h2>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px 120px 80px 80px", gap: 8, padding: "10px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", fontSize: 11.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          <div>Ref</div>
          <div>Vehicle</div>
          <div>Status</div>
          <div>Range</div>
          <div>Tier</div>
          <div style={{ textAlign: "right" }}>Date</div>
        </div>
        {estimates.slice(0, 20).map(e => (
          <Link key={e.id} href={`/estimate/${e.id}`} style={{ display: "grid", gridTemplateColumns: "140px 1fr 100px 120px 80px 80px", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "center", textDecoration: "none", color: "var(--text)" }}>
            <div style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{e.estimate_number ?? e.id.slice(0, 8)}</div>
            <div style={{ fontSize: 13 }}>
              {getVehicle(e.vehicles) ? `${getVehicle(e.vehicles)!.year} ${getVehicle(e.vehicles)!.make} ${getVehicle(e.vehicles)!.model}` : "—"}
            </div>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: 11.5, fontWeight: 500, background: `color-mix(in oklch, ${STATUS_COLORS[e.status] ?? "var(--muted)"} 15%, transparent)`, color: STATUS_COLORS[e.status] ?? "var(--muted)" }}>
                {e.status}
              </span>
            </div>
            <div style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>
              {e.tier1_low && e.tier1_high ? fmtRange(e.tier1_low, e.tier1_high) : "—"}
            </div>
            <div style={{ fontSize: 12 }}>
              <span style={{ padding: "2px 8px", borderRadius: 999, background: e.tier === "tier2" ? "var(--accent-soft)" : "var(--surface-2)", color: e.tier === "tier2" ? "var(--accent-ink)" : "var(--text-2)", fontSize: 11.5, fontWeight: 500 }}>
                {e.tier === "tier2" ? "Full" : "Free"}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}>
              {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </Link>
        ))}
        {estimates.length === 0 && (
          <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
            No estimates yet.{" "}
            <Link href="/estimate" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Create your first one →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

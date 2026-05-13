import Link from "next/link";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import { fmtRange } from "@/lib/utils";

export const metadata = { title: "My Reports — RigCheck" };

const SEV_COLOR: Record<string, string> = {
  Minor: "var(--info)",
  Moderate: "oklch(0.7 0.16 60)",
  Severe: "var(--danger)",
};

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const service = await createServiceClient();
  const { data: profile } = await service
    .from("users")
    .select("org_id, full_name")
    .eq("id", user.id)
    .single();

  const orgId = profile?.org_id;
  const name = profile?.full_name ?? user.email ?? "there";

  const { data: estimates } = orgId
    ? await service
        .from("estimates")
        .select("id, rc_number, tier, severity, tier1_low, tier1_high, created_at, vehicles(year, make, model)")
        .eq("org_id", orgId)
        .eq("tier", "tier2")
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div style={{ padding: "32px 32px 80px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.025em" }}>
          My Reports
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-2)", margin: 0 }}>
          Welcome back, {name}
        </p>
      </div>

      {estimates && estimates.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {estimates.map((e: any) => {
            const vehicle = e.vehicles;
            const label = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Vehicle";
            const date = new Date(e.created_at).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            });
            return (
              <div key={e.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{e.rc_number}</span>
                  {e.severity && (
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: `color-mix(in oklch, ${SEV_COLOR[e.severity] ?? "var(--muted)"} 15%, transparent)`, color: SEV_COLOR[e.severity] ?? "var(--text-2)" }}>
                      {e.severity}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, color: "var(--text-2)" }}>{date}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {fmtRange(e.tier1_low, e.tier1_high)}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <Link href={`/estimate/${e.id}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: 34, borderRadius: 8, background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                    View report
                  </Link>
                  <a href={`/api/pdf/${e.id}`} download style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 34, width: 36, borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--text-2)", textDecoration: "none", fontSize: 14 }}>
                    📄
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 24px", border: "2px dashed var(--border)", borderRadius: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🚛</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px" }}>No reports yet</h3>
          <p style={{ fontSize: 14, color: "var(--text-2)", margin: "0 0 24px" }}>
            Get a free estimate and unlock the full report to see it here.
          </p>
          <Link href="/estimate" style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 40, padding: "0 20px", borderRadius: 10, background: "var(--accent)", color: "white", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
            Get free estimate
          </Link>
        </div>
      )}
    </div>
  );
}

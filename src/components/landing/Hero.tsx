import Link from "next/link";
import { TruckSilhouette } from "@/components/shared/TruckSilhouette";
import type { Hotspot } from "@/lib/types";

const moderateHotspots: Hotspot[] = [
  { x: 22, y: 38, label: "Headlamp shatter", severity: "severe" },
  { x: 34, y: 50, label: "Fender deformation", severity: "severe" },
  { x: 50, y: 42, label: "Hood scoop crack", severity: "moderate" },
  { x: 58, y: 60, label: "Fairing upper", severity: "moderate" },
  { x: 70, y: 38, label: "Mirror arm", severity: "moderate" },
];

export function Hero() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 56px", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56, alignItems: "center" }}>
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", background: "var(--accent-soft)", color: "var(--accent-ink)", borderRadius: 999, fontSize: 12.5, fontWeight: 600 }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--accent)" }}/>
          Built for Class 3–8 · works on any phone
        </div>
        <h1 style={{ fontSize: 64, lineHeight: 1.02, letterSpacing: "-0.035em", margin: "18px 0 18px", fontWeight: 600 }}>
          Know what your truck repair{" "}
          <em style={{ fontStyle: "normal", color: "var(--accent)" }}>should</em>{" "}
          cost — before the shop tells you.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.5, color: "var(--text-2)", maxWidth: 540, margin: 0 }}>
          Snap a few photos. Our AI gives you a range estimate in{" "}
          <strong style={{ color: "var(--text)" }}>under 90 seconds</strong>. Free, no signup, no app to install. When you need a line-item report for your insurer, it&apos;s{" "}
          <strong style={{ color: "var(--text)" }}>$49</strong>.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 28, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/estimate" style={{
            display: "inline-flex", alignItems: "center", gap: 8, height: 52, padding: "0 22px",
            borderRadius: 14, border: "none", background: "var(--accent)", color: "white",
            fontWeight: 600, fontSize: 16, textDecoration: "none",
            boxShadow: "0 1px 0 rgba(255,255,255,.18) inset, 0 2px 8px rgba(20,16,8,.2)"
          }}>
            📷 Start free estimate
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12.5, color: "var(--muted)" }}>
            <span>✓ No credit card</span>
            <span>✓ No account</span>
            <span>✓ Works offline</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 36, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
          {[["503K", "large-truck crashes/yr"], ["15–35%", "appraisal variance"], ["~$149/hr", "median labor rate"]].map(([n, l]) => (
            <div key={n}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>{n}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero visual */}
      <div style={{ position: "relative", height: 540, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 520, padding: 0, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow-3)", transform: "rotate(-1.2deg)" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--success)" }}/>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Estimate ready · 47 sec</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", fontSize: 11.5, fontWeight: 500, borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent-ink)" }}>Tier 1 · free</span>
          </div>
          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>2021 Freightliner Cascadia 126</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 600, letterSpacing: "-0.025em" }}>$8,200</span>
                <span style={{ color: "var(--muted)", fontSize: 18 }}>–</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 38, fontWeight: 600, letterSpacing: "-0.025em" }}>$14,600</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>LH cab fairing, fender &amp; headlamp · moderate</div>
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 10, height: 180, position: "relative", padding: 8 }}>
              <TruckSilhouette kind="tractor" hotspots={moderateHotspots} />
            </div>
            <Link href="/estimate" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              height: 42, borderRadius: 10, background: "var(--accent)", color: "white",
              textDecoration: "none", fontWeight: 500, fontSize: 14,
              boxShadow: "0 1px 0 rgba(255,255,255,.18) inset"
            }}>
              See full $49 report →
            </Link>
          </div>
        </div>

        {/* Floating badge */}
        <div style={{ position: "absolute", left: -8, top: 60, padding: "10px 14px", transform: "rotate(-3deg)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow-2)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 99, background: "var(--success-soft)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🛡</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Chain-of-custody preserved</div>
            <div style={{ fontSize: 10.5, color: "var(--muted)" }}>Hashed, GPS-stamped, adjuster-ready</div>
          </div>
        </div>
      </div>
    </section>
  );
}

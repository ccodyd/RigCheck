"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { DamageMap } from "@/components/result/DamageMap";
import { LineItems } from "@/components/result/LineItems";
import { ReasoningPanel } from "@/components/result/ReasoningPanel";
import { Logo } from "@/components/shared/Logo";
import { fmt, fmtRange } from "@/lib/utils";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  estimate: any;
  userId: string | null;
}

const SEV_COLOR: Record<string, string> = {
  Minor: "var(--info)",
  Moderate: "oklch(0.7 0.16 60)",
  Severe: "var(--danger)",
};

export function ResultClient({ estimate, userId }: Props) {
  const [unlocking, setUnlocking] = useState(false);
  const [guestSession, setGuestSession] = useState("");
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";
  const isTier2 = estimate.tier === "tier2";

  useEffect(() => {
    setGuestSession(sessionStorage.getItem("guestSession") ?? "");
  }, []);

  async function handleUnlock() {
    setUnlocking(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estimateId: estimate.id }),
    });
    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      setUnlocking(false);
      alert("Could not start checkout. Please try again.");
    }
  }

  const vehicle = estimate.vehicles;
  const vehicleLabel = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Vehicle";
  const lineItems = estimate.estimate_line_items ?? [];
  const photos = estimate.estimate_photos ?? [];
  const hotspots = estimate.hotspots ?? [];
  const laborRate = estimate.labor_rate ?? 149;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <Logo />
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <Link href="/estimate" style={{ fontSize: 13, color: "var(--text-2)", textDecoration: "none" }}>New estimate</Link>
          {userId ? (
            <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 14px", borderRadius: 8, background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>My reports</Link>
          ) : (
            <Link href={`/sign-in`} style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 14px", borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header card */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--success)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--success)" }}>Estimate ready</span>
            <span style={{ flex: 1 }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", fontSize: 12, fontWeight: 500, borderRadius: 999, background: isTier2 ? "var(--accent-soft)" : "var(--surface-2)", color: isTier2 ? "var(--accent-ink)" : "var(--text-2)" }}>
              {isTier2 ? "Full Report" : "Tier 1 · Free"}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{vehicleLabel}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em" }}>
              {fmtRange(estimate.tier1_low, estimate.tier1_high)}
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: `color-mix(in oklch, ${SEV_COLOR[estimate.severity] ?? "var(--muted)"} 15%, transparent)`, color: SEV_COLOR[estimate.severity] ?? "var(--text-2)", fontSize: 12.5, fontWeight: 600 }}>
              {estimate.severity ?? "—"} damage
            </span>
            {estimate.teardown && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: "var(--danger-soft)", color: "var(--danger)", fontSize: 12.5, fontWeight: 600 }}>
                ⚠ Teardown recommended
              </span>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: "var(--surface-2)", color: "var(--text-2)", fontSize: 12.5 }}>
              {estimate.confidence != null ? `${Math.round(estimate.confidence * 100)}% confidence` : ""}
            </span>
          </div>
          {estimate.headline && (
            <p style={{ fontSize: 14, color: "var(--text-2)", marginTop: 14, lineHeight: 1.6, marginBottom: 0, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              {estimate.headline}
            </p>
          )}
        </div>

        {/* Post-payment account claim banner */}
        {paymentSuccess && isTier2 && !userId && (
          <div style={{ background: "var(--success-soft, oklch(0.97 0.05 145))", border: "1px solid var(--success)", borderRadius: 14, padding: "18px 22px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Your full report is unlocked!</div>
              <div style={{ fontSize: 13, color: "var(--text-2)" }}>Create a free account to save it and access it anytime.</div>
            </div>
            <Link
              href={`/sign-up${guestSession ? `?guestSession=${guestSession}` : ""}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 38, padding: "0 18px", borderRadius: 10, background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
              Create free account →
            </Link>
          </div>
        )}

        {/* Damage map */}
        {hotspots.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Damage map</h3>
            <DamageMap hotspots={hotspots} />
          </div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Submitted photos</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
              {photos.map((p: { storage_path: string; angle_label?: string }, i: number) => (
                <div key={i} style={{ aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", background: "var(--surface-2)" }}>
                  <img src={`/api/photos/view?path=${encodeURIComponent(p.storage_path)}`} alt={p.angle_label ?? `Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier 2 content */}
        {isTier2 && lineItems.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Line-item breakdown</h3>
            <LineItems items={lineItems} laborRate={laborRate} />
          </div>
        )}

        {/* Upsell block — Tier 1 only */}
        {!isTier2 && (
          <div style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)", borderRadius: 16, padding: 28, marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--accent-ink)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                  Unlock the full $49 report
                </h3>
                <ul style={{ margin: "0 0 20px", padding: "0 0 0 18px", color: "var(--accent-ink)", fontSize: 14, lineHeight: 1.8 }}>
                  <li>Line-item parts &amp; labor breakdown</li>
                  <li>OEM part numbers &amp; current prices</li>
                  <li>Adjuster-ready PDF with photo chain-of-custody</li>
                  <li>Shop rate comparison for your area</li>
                  <li>AI reasoning transcript (admissible for disputes)</li>
                </ul>
                <button onClick={handleUnlock} disabled={unlocking}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 48, padding: "0 24px", borderRadius: 12, border: "none", background: "var(--accent)", color: "white", fontWeight: 600, fontSize: 15, cursor: unlocking ? "wait" : "pointer", opacity: unlocking ? 0.7 : 1 }}>
                  {unlocking ? "Loading…" : `🔓 Unlock full report — ${fmt(49)}`}
                </button>
              </div>
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>$49</div>
                <div style={{ fontSize: 11.5, color: "var(--accent-ink)", marginTop: 4 }}>one-time</div>
              </div>
            </div>
          </div>
        )}

        {/* Reasoning */}
        {isTier2 && estimate.reasoning && (
          <div style={{ marginBottom: 24 }}>
            <ReasoningPanel reasoning={estimate.reasoning} />
          </div>
        )}

        {/* PDF download for Tier 2 */}
        {isTier2 && (
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <a href={`/api/pdf/${estimate.id}`} download style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 18px", borderRadius: 10, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              📄 Download PDF report
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

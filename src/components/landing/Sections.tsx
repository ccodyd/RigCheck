"use client";

import { useState } from "react";
import Link from "next/link";
import { TruckSilhouette } from "@/components/shared/TruckSilhouette";
import { Logo } from "@/components/shared/Logo";
import type { Hotspot } from "@/lib/types";

const moderateHotspots: Hotspot[] = [
  { x: 22, y: 38, label: "Headlamp shatter", severity: "severe" },
  { x: 34, y: 50, label: "Fender deformation", severity: "severe" },
  { x: 50, y: 42, label: "Hood scoop crack", severity: "moderate" },
  { x: 58, y: 60, label: "Fairing upper", severity: "moderate" },
  { x: 70, y: 38, label: "Mirror arm", severity: "moderate" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const moderateDamage = [
  { id: "d1", part: "LH headlamp assembly (LED)", action: "Replace", partNo: "A06-90531-006", partCost: 1485, hours: 1.8 },
  { id: "d2", part: "LH front fender (fiberglass)", action: "Replace", partNo: "A17-19982-001", partCost: 1240, hours: 4.6 },
  { id: "d3", part: "LH cab side fairing (upper)", action: "Replace", partNo: "A18-67220-014", partCost: 980, hours: 3.4 },
  { id: "d4", part: "LH cab side fairing (lower)", action: "Repair", partNo: "—", partCost: 0, hours: 6.2 },
  { id: "d5", part: "Hood scoop, LH", action: "Replace", partNo: "A17-20910-003", partCost: 410, hours: 1.6 },
];

export function TrustStrip() {
  return (
    <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)" }} id="how-it-works">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "22px 24px", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase" }}>Built on the data trucking already trusts</div>
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          {[["NHTSA vPIC", "VIN decode"], ["MOTOR FleetCross", "parts & labor"], ["ARI Labor Guides", "labor times"], ["Samsara · Geotab · Motive", "telematics"], ["Fullbay", "shop network"]].map(([n, sub]) => (
            <div key={n}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "01", t: "Take 6–8 photos", d: "We guide you through angles — front, sides, close-ups, plus VIN plate and odometer. Works on any phone browser, no app to install.", ic: "📷" },
    { n: "02", t: "AI does the work", d: "YOLO + SAM detect damage at the pixel level. A vision LLM reasons about repair vs replace, flags hidden frame damage, prices parts and labor at your local rate.", ic: "✨" },
    { n: "03", t: "You get a real number", d: "A fair range in 90 seconds. Pay $49 if you need the full line-item report for an insurer, shop, or to dispute a quote.", ic: "🔧" },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ maxWidth: 640, marginBottom: 36 }}>
        <div style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>How it works</div>
        <h2 style={{ fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "8px 0 12px", fontWeight: 600 }}>From "what&apos;s this gonna cost" to a defensible number in 90 seconds.</h2>
        <p style={{ fontSize: 16, color: "var(--text-2)", margin: 0, lineHeight: 1.5 }}>The product every fleet manager wishes existed. Now it works for the driver standing in the parking lot, too.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {steps.map(s => (
          <div key={s.n} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, boxShadow: "var(--shadow-1)", padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-soft)", color: "var(--accent-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.ic}</div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 600, color: "var(--surface-3)" }}>{s.n}</span>
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.015em" }}>{s.t}</div>
              <div style={{ fontSize: 13.5, color: "var(--text-2)", marginTop: 6, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SampleReport() {
  return (
    <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} id="sample-report">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 48, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Sample Tier 2 report</div>
          <h2 style={{ fontSize: 38, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "8px 0 16px", fontWeight: 600 }}>The report your shop, insurer, and adjuster all take seriously.</h2>
          <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.5, margin: "0 0 24px" }}>Every line cited. Every part numbered. Labor times from real industry data, priced at your local rate.</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {["Up to 30+ line items with part numbers + labor hours", "Confidence score per line, with reasoning", "Hidden-damage flag on frame-adjacent impacts (FMCSA: 30–40% hides until teardown)", "ADAS recalibration callout (AAA: +25–37% to total)", "Local labor rate derivation (BLS QCEW × 3.5 multiplier)", "CCC-EMS compatible export for adjusters", "Chain-of-custody manifest: photo hashes, GPS, device IDs"].map(t => (
              <li key={t} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--text-2)" }}>
                <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}>✓</span>{t}
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
            <Link href="/estimate" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px", borderRadius: 12, background: "var(--accent)", color: "white", textDecoration: "none", fontWeight: 500 }}>
              📷 Try it free
            </Link>
          </div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-3)", padding: 0 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: 12 }}>RC-2419</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>2021 Cascadia 126</span>
            </div>
            <span style={{ padding: "3px 9px", borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent-ink)", fontSize: 11.5, fontWeight: 500 }}>Tier 2 · $49</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
            <div style={{ padding: 18, borderRight: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: ".03em" }}>TOTAL · ALL-IN</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", marginTop: 4 }}>$11,842</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>9 line items · 38.6h labor · 81% confidence</div>
            </div>
            <div style={{ padding: 18, background: "var(--surface-2)" }}>
              <TruckSilhouette kind="tractor" hotspots={moderateHotspots} />
            </div>
          </div>
          <div>
            {moderateDamage.map((d, i) => (
              <div key={d.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 12, padding: "11px 18px", borderTop: i ? "1px solid var(--border)" : "none", alignItems: "center", fontSize: 12.5 }}>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: 10.5 }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{d.part}</div>
                  {d.partNo !== "—" && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>{d.partNo}</div>}
                </div>
                <span style={{ padding: "2px 7px", borderRadius: 5, background: d.action === "Replace" ? "var(--accent-soft)" : "var(--surface-2)", color: d.action === "Replace" ? "var(--accent-ink)" : "var(--text-2)", fontSize: 10.5, fontWeight: 500 }}>{d.action}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{fmt((d.partCost || 0) + Math.round(d.hours * 149))}</span>
              </div>
            ))}
            <div style={{ padding: "10px 18px", textAlign: "center", fontSize: 11.5, color: "var(--muted)", borderTop: "1px solid var(--border)" }}>+ 4 more lines · ADAS calibration · refinish</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ForWho() {
  const buckets = [
    { tag: "Solo drivers & owner-operators", ic: "👤", pitch: "Pulled over with a shop telling you $4,800? Stop. Snap photos here first.", bullets: ["Free Tier 1 range, no signup", "$49 if you need the full report to push back", "Works on the cab's phone, dead-zone friendly"], cta: "Get my free estimate", href: "/estimate" },
    { tag: "Small fleets (6–50 trucks)", ic: "🚚", pitch: "Stop discovering real cost after the shop has already started.", bullets: ["$19/truck/month, no hardware, no contract", "Send-to-driver SMS link — no app install", "Spend analytics by vehicle and damage type"], cta: "See fleet dashboard", href: "/dashboard" },
    { tag: "Repair shops & adjusters", ic: "🔧", pitch: "Receive estimates that arrive pre-photographed and structured.", bullets: ["$19/report or $149/mo as a Fullbay add-on", "CCC-EMS and Xactimate-compatible export", "Side-by-side comparison view for adjusters"], cta: "Shop & adjuster plans", href: "/sign-up" },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px" }} id="fleets">
      <div style={{ maxWidth: 640, marginBottom: 36 }}>
        <div style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Built for the whole repair lifecycle</div>
        <h2 style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "8px 0 0", fontWeight: 600 }}>One product. Three people who need it.</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {buckets.map((b, i) => (
          <div key={b.tag} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, background: i === 0 ? "var(--accent-soft)" : "var(--surface)", border: `1px solid ${i === 0 ? "transparent" : "var(--border)"}`, borderRadius: 16, boxShadow: "var(--shadow-1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: i === 0 ? "var(--accent)" : "var(--surface-2)", color: i === 0 ? "white" : "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{b.ic}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? "var(--accent-ink)" : "var(--text-2)" }}>{b.tag}</div>
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em", color: i === 0 ? "var(--accent-ink)" : "var(--text)" }}>{b.pitch}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {b.bullets.map(t => (
                <li key={t} style={{ display: "flex", gap: 8, fontSize: 13, color: i === 0 ? "var(--accent-ink)" : "var(--text-2)", lineHeight: 1.45 }}>
                  <span>✓</span>{t}
                </li>
              ))}
            </ul>
            <Link href={b.href} style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 36, borderRadius: 10, background: i === 0 ? "var(--accent)" : "var(--surface)", border: `1px solid ${i === 0 ? "transparent" : "var(--border-strong)"}`, color: i === 0 ? "white" : "var(--text)", textDecoration: "none", fontWeight: 500, fontSize: 14 }}>
              {b.cta} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Pricing() {
  const plans = [
    { name: "Free", price: "$0", period: "no signup", tag: "Tier 1 estimate", desc: "For the moment you're standing next to the truck.", features: ["Photo-based damage range", "VIN auto-decode", "Comparable repairs from your area", "Watermarked PDF summary"], cta: "Start free", href: "/estimate", primary: false, featured: false },
    { name: "Per report", price: "$49", period: "one-time", tag: "Tier 2 detailed report", desc: "When you need the line-item report your insurer or adjuster will respect.", features: ["Up to 30+ line items + part numbers", "Labor hours at your local rate", "Confidence scores + AI reasoning", "Hidden-damage flag on frame impact", "CCC-EMS / Xactimate export", "Chain-of-custody manifest"], cta: "Start free, pay later", href: "/estimate", primary: true, featured: true },
    { name: "Owner-operator", price: "$29", period: "/month", tag: "Unlimited Tier 2", desc: "For 1–5 trucks. Below the Netflix-plus-one threshold.", features: ["Unlimited Tier 2 reports", "Send-to-driver SMS link", "Spend tracking", "Telematics: Samsara, Geotab, Motive"], cta: "Sign up", href: "/sign-up", primary: false, featured: false },
    { name: "Small fleet", price: "$19", period: "/truck/mo", tag: "6–50 trucks", desc: "No hardware, no contract.", features: ["Everything in owner-operator", "Kanban pipeline + shop comparison", "Variance alerts on shop quotes", "Multi-user, roles", "API & webhooks"], cta: "Book a demo", href: "/sign-up", primary: false, featured: false },
  ];
  return (
    <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} id="pricing">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ maxWidth: 640, marginBottom: 36, textAlign: "center", margin: "0 auto 36px" }}>
          <div style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Pricing</div>
          <h2 style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "8px 0 0", fontWeight: 600 }}>Free to try. $49 to win the argument.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {plans.map(p => (
            <div key={p.name} style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12, background: "var(--surface)", border: `${p.featured ? 2 : 1}px solid ${p.featured ? "var(--accent)" : "var(--border)"}`, borderRadius: 16, boxShadow: p.featured ? "var(--shadow-2)" : "var(--shadow-1)", position: "relative" }}>
              {p.featured && <div style={{ position: "absolute", top: -12, right: 16, padding: "3px 10px", background: "var(--accent)", color: "white", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>Most popular</div>}
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted)", letterSpacing: ".04em", textTransform: "uppercase" }}>{p.tag}</div>
                <div style={{ fontSize: 19, fontWeight: 600, marginTop: 4 }}>{p.name}</div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>{p.price}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.period}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.45 }}>{p.desc}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: "flex", gap: 8, fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.4 }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", height: 36, borderRadius: 10, background: p.primary ? "var(--accent)" : "var(--surface)", border: `1px solid ${p.primary ? "transparent" : "var(--border-strong)"}`, color: p.primary ? "white" : "var(--text)", textDecoration: "none", fontWeight: 500, fontSize: 14 }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  const qs = [
    { q: "Do I really not need an account for a free estimate?", a: "Right. Take photos, get a range. Your data is held under a tokenized session — when you upgrade to a $49 Tier 2 report, we ask you to sign in so we can email the PDF." },
    { q: "How accurate is it on Class 8 frame damage?", a: "We're realistic. On clean cosmetic damage we're typically within 10% of shop quotes. On frame-adjacent impacts we explicitly flag teardown — 30–40% of true cost is hidden until the shop pulls the front clip per FMCSA crash data." },
    { q: "Will my shop or insurer accept this?", a: "The Tier 2 report exports to CCC-EMS and Xactimate-compatible formats and ships with a chain-of-custody manifest (photo hashes, GPS, device IDs, model versions). Adjusters work with this every day." },
    { q: "What's the labor rate based on?", a: "Bootstrapped from BLS QCEW wages for SOC 49-3031 (Bus and Truck Mechanics) by MSA, multiplied to a door rate, then layered with shop-type and cost-of-living adjustments. National median lands at $149/hr — matches Fullbay's 2025–26 State of Heavy-Duty Repair." },
    { q: "Does this work in dead zones?", a: "Yes — the photo capture flow is a PWA with offline storage. Capture roadside, upload when you have signal. No app to install." },
    { q: "How is this different from CCC, Mitchell, or Audatex?", a: "Those are insurance-grade estimating platforms for passenger autos. We're the only tool a driver can pull out at a roadside breakdown — priced for a 5-truck operator and built specifically on Class 3–8 damage patterns." },
  ];
  return (
    <section style={{ maxWidth: 880, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>FAQ</div>
        <h2 style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.025em", margin: "8px 0 0", fontWeight: 600 }}>The questions every driver asks first.</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {qs.map((q, i) => (
          <div key={i} style={{ borderTop: "1px solid var(--border)" }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", padding: "18px 4px", display: "flex", alignItems: "center", justifyContent: "space-between", border: 0, background: "transparent", textAlign: "left", cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 500, color: "var(--text)" }}>
              <span>{q.q}</span>
              <span style={{ color: "var(--muted)" }}>{open === i ? "✕" : "+"}</span>
            </button>
            {open === i && <div style={{ padding: "0 4px 20px", fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.55, maxWidth: 680 }}>{q.a}</div>}
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--border)" }} />
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ padding: "44px 48px", textAlign: "center", background: "linear-gradient(135deg, var(--accent) 0%, oklch(0.6 0.18 30) 100%)", color: "white", border: 0, borderRadius: 16, boxShadow: "var(--shadow-3)" }}>
        <h2 style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>The shop is writing your quote right now.</h2>
        <p style={{ fontSize: 17, opacity: .92, marginTop: 12, lineHeight: 1.4 }}>Get a second opinion in 90 seconds. Free, no signup. Then pay $49 only if it saves you more.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
          <Link href="/estimate" style={{ height: 52, padding: "0 26px", borderRadius: 14, border: 0, background: "white", color: "var(--accent-ink)", fontWeight: 600, fontSize: 16, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            📷 Start free estimate
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32 }}>
        <div>
          <Logo />
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 10, maxWidth: 280, lineHeight: 1.45 }}>AI repair estimation built specifically for Class 3–8 trucks. Made in Austin, TX.</div>
        </div>
        {[["Product", ["How it works", "Pricing", "Sample report", "Integrations", "API"]], ["For", ["Owner-operators", "Small fleets", "Repair shops", "Adjusters"]], ["Company", ["About", "Trust & security", "Privacy", "Terms"]]].map(([h, items]) => (
          <div key={h as string}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>{h}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {(items as string[]).map(it => <li key={it}><a href="#" style={{ fontSize: 12.5, color: "var(--text-2)", textDecoration: "none" }}>{it}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--muted)" }}>
        <div>© 2026 RigCheck Labs, Inc.</div>
        <div>Not affiliated with CCC, Mitchell, or Audatex. Labor times via ARI; VIN decode via NHTSA vPIC.</div>
      </div>
    </footer>
  );
}

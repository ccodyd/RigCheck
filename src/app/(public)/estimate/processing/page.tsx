"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TruckSilhouette } from "@/components/shared/TruckSilhouette";

const STAGES = [
  { label: "Decoding VIN & vehicle specs", dur: 1200 },
  { label: "Analyzing damage photos", dur: 2800 },
  { label: "Identifying affected panels & parts", dur: 2200 },
  { label: "Pulling OEM part costs", dur: 1600 },
  { label: "Applying regional labor rates", dur: 1000 },
  { label: "Calculating confidence scores", dur: 1400 },
  { label: "Finalizing estimate", dur: 800 },
];

function ProcessingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const estimateId = params.get("id");

  const [stageIdx, setStageIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 250);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let cumulative = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    STAGES.forEach((s, i) => {
      cumulative += s.dur;
      timers.push(setTimeout(() => setStageIdx(Math.min(i + 1, STAGES.length - 1)), cumulative));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Poll estimate status
  useEffect(() => {
    if (!estimateId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/estimates/${estimateId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "ready" || data.status === "error") {
            clearInterval(interval);
            router.push(`/estimate/${estimateId}`);
          }
        }
      } catch {
        // keep polling
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [estimateId, router]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {/* Animated truck */}
        <div style={{ width: 200, height: 120, margin: "0 auto 32px", opacity: 0.85 }}>
          <TruckSilhouette kind="tractor" />
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Analyzing your photos
        </h2>
        <p style={{ color: "var(--text-2)", fontSize: 15, margin: "0 0 36px" }}>
          Our AI is working — this usually takes under 90 seconds.
        </p>

        {/* Stages */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, textAlign: "left" }}>
          {STAGES.map((s, i) => {
            const done = i < stageIdx;
            const active = i === stageIdx;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: i > stageIdx ? 0.3 : 1, transition: "opacity .3s" }}>
                <div style={{ width: 20, height: 20, borderRadius: 99, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, background: done ? "var(--success)" : active ? "var(--accent)" : "var(--surface-2)", color: done || active ? "white" : "var(--muted)", border: `1.5px solid ${done ? "var(--success)" : active ? "var(--accent)" : "var(--border)"}` }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? "var(--text)" : "var(--text-2)" }}>
                  {s.label}
                  {active && <span style={{ display: "inline-block", marginLeft: 6, animation: "spin 1s linear infinite" }}>⟳</span>}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--muted)", fontSize: 13 }}>
          <span style={{ display: "inline-block", animation: "pulse 1.5s ease-in-out infinite", width: 8, height: 8, borderRadius: 99, background: "var(--accent)" }} />
          {elapsed}s elapsed
        </div>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "var(--muted)" }}>Loading…</span></div>}>
      <ProcessingContent />
    </Suspense>
  );
}

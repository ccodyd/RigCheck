"use client";

import { useState } from "react";

interface ReasoningData {
  damageAssessment: string;
  partsStrategy: string;
  laborJustification: string;
  hiddenDamageRisk: string;
  confidence: number;
}

interface Props {
  reasoning: ReasoningData;
}

export function ReasoningPanel({ reasoning }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🧠</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>AI Reasoning</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>How the estimate was calculated</div>
          </div>
        </div>
        <span style={{ fontSize: 18, color: "var(--muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>⌄</span>
      </button>

      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 6, margin: "14px 0", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "var(--text-2)" }}>Confidence</div>
            <div style={{ flex: 1, height: 6, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${reasoning.confidence * 100}%`, background: reasoning.confidence > 0.8 ? "var(--success)" : reasoning.confidence > 0.6 ? "oklch(0.7 0.16 60)" : "var(--danger)", borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{Math.round(reasoning.confidence * 100)}%</div>
          </div>

          {[
            { label: "Damage Assessment", text: reasoning.damageAssessment },
            { label: "Parts Strategy", text: reasoning.partsStrategy },
            { label: "Labor Justification", text: reasoning.laborJustification },
            { label: "Hidden Damage Risk", text: reasoning.hiddenDamageRisk },
          ].map(({ label, text }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

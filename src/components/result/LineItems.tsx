"use client";

import { fmt } from "@/lib/utils";
import type { LineItem } from "@/lib/types";

interface Props {
  items: LineItem[];
  laborRate: number;
}

const SEV_COLOR: Record<string, string> = {
  minor: "var(--info)",
  moderate: "oklch(0.7 0.16 60)",
  severe: "var(--danger)",
};

export function LineItems({ items, laborRate }: Props) {
  const totalParts = items.reduce((s, i) => s + (i.partCost ?? 0), 0);
  const totalLabor = items.reduce((s, i) => s + i.hours * laborRate, 0);
  const grandTotal = totalParts + totalLabor;

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 90px", gap: 8, padding: "10px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", fontSize: 11.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        <div>Part / Operation</div>
        <div style={{ textAlign: "right" }}>Severity</div>
        <div style={{ textAlign: "right" }}>Parts</div>
        <div style={{ textAlign: "right" }}>Hours</div>
        <div style={{ textAlign: "right" }}>Labor</div>
      </div>

      {/* Rows */}
      {items.map((item, i) => {
        const labor = item.hours * laborRate;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 90px", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--border)", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.part}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{item.action}</div>
              {item.partNo && <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 1 }}>{item.partNo}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: `color-mix(in oklch, ${SEV_COLOR[item.severity]} 15%, transparent)`, color: SEV_COLOR[item.severity] }}>
                {item.severity}
              </span>
            </div>
            <div style={{ textAlign: "right", fontSize: 13, fontFamily: "var(--font-mono)" }}>
              {item.partCost != null ? fmt(item.partCost) : "—"}
            </div>
            <div style={{ textAlign: "right", fontSize: 13, fontFamily: "var(--font-mono)" }}>
              {item.hours.toFixed(1)}
            </div>
            <div style={{ textAlign: "right", fontSize: 13, fontFamily: "var(--font-mono)" }}>
              {fmt(labor)}
            </div>
          </div>
        );
      })}

      {/* Totals */}
      <div style={{ padding: "14px 16px", background: "var(--surface-2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>
          <span>Parts subtotal</span><span style={{ fontFamily: "var(--font-mono)" }}>{fmt(totalParts)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-2)", marginBottom: 10 }}>
          <span>Labor subtotal ({fmt(laborRate)}/hr)</span><span style={{ fontFamily: "var(--font-mono)" }}>{fmt(totalLabor)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          <span>Estimated total</span><span style={{ fontFamily: "var(--font-mono)" }}>{fmt(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}

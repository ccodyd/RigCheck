"use client";

import { useState } from "react";
import type { VinDecodeResult } from "@/lib/types";

interface Props {
  vin: string;
  setVin: (v: string) => void;
  vehicle: VinDecodeResult | null;
  setVehicle: (v: VinDecodeResult | null) => void;
  onNext: () => void;
}

export function StepVehicle({ vin, setVin, vehicle, setVehicle, onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function decodeVin() {
    if (vin.length < 17) return;
    setLoading(true);
    setError("");
    setVehicle(null);
    try {
      const res = await fetch(`/api/vin/decode?vin=${encodeURIComponent(vin.trim().toUpperCase())}`);
      if (!res.ok) throw new Error("VIN not found");
      const data = await res.json();
      setVehicle(data);
    } catch {
      setError("Could not decode VIN. Check the number and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em", margin: "0 0 8px" }}>What vehicle was damaged?</h2>
        <p style={{ color: "var(--text-2)", fontSize: 15, margin: 0 }}>Enter the VIN to auto-fill year, make, model, and weight class.</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          value={vin}
          onChange={e => { setVin(e.target.value.toUpperCase()); setVehicle(null); }}
          onBlur={decodeVin}
          maxLength={17}
          placeholder="1FUJGBDV8CLBP8834"
          style={{ flex: 1, height: 48, padding: "0 14px", borderRadius: 10, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 15, fontFamily: "var(--font-mono)", outline: "none", letterSpacing: "0.04em", boxSizing: "border-box" }}
        />
        <button onClick={decodeVin} disabled={loading || vin.length < 17}
          style={{ height: 48, padding: "0 18px", borderRadius: 10, border: "none", background: "var(--accent)", color: "white", fontWeight: 600, fontSize: 14, cursor: vin.length >= 17 && !loading ? "pointer" : "not-allowed", opacity: vin.length < 17 || loading ? 0.5 : 1 }}>
          {loading ? "…" : "Decode"}
        </button>
      </div>

      {error && <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {vehicle && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--success)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--success)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--success)" }}>VIN decoded</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Year", vehicle.year],
              ["Make", vehicle.make],
              ["Model", vehicle.model],
              ["Trim", vehicle.trim || "—"],
              ["GVWR", vehicle.gvwr ? `${vehicle.gvwr.toLocaleString()} lb` : "—"],
              ["Engine", vehicle.engine || "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "var(--accent-soft)", borderRadius: 10, marginBottom: 28 }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <span style={{ fontSize: 13, color: "var(--accent-ink)" }}>VIN is on the dashboard (driver side), door jamb sticker, or registration. Find-my-VIN also works offline.</span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onNext} disabled={!vehicle}
          style={{ height: 48, padding: "0 28px", borderRadius: 12, border: "none", background: "var(--accent)", color: "white", fontWeight: 600, fontSize: 15, cursor: vehicle ? "pointer" : "not-allowed", opacity: vehicle ? 1 : 0.4 }}>
          Next: Incident details →
        </button>
      </div>
    </div>
  );
}

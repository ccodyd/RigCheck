"use client";

import type { IncidentDetails } from "@/lib/types";

const INCIDENT_TYPES = [
  { value: "collision", label: "Collision", icon: "💥" },
  { value: "rollover", label: "Rollover", icon: "🔄" },
  { value: "fire", label: "Fire/heat", icon: "🔥" },
  { value: "weather", label: "Weather/hail", icon: "⛈" },
  { value: "vandalism", label: "Vandalism", icon: "🔨" },
  { value: "other", label: "Other", icon: "📋" },
];

interface Props {
  incident: IncidentDetails;
  setIncident: (v: IncidentDetails) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepIncident({ incident, setIncident, onBack, onNext }: Props) {
  const set = (patch: Partial<IncidentDetails>) => setIncident({ ...incident, ...patch });
  const valid = incident.description.trim().length > 10;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em", margin: "0 0 8px" }}>Describe the incident</h2>
        <p style={{ color: "var(--text-2)", fontSize: 15, margin: 0 }}>More detail = better estimate accuracy.</p>
      </div>

      {/* Incident type */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Incident type</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {INCIDENT_TYPES.map(t => (
            <button key={t.value} onClick={() => set({ type: t.value as IncidentDetails["type"] })}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 10px", borderRadius: 10, border: `1.5px solid ${incident.type === t.value ? "var(--accent)" : "var(--border)"}`, background: incident.type === t.value ? "var(--accent-soft)" : "var(--surface)", cursor: "pointer", transition: "border-color .15s" }}>
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: incident.type === t.value ? "var(--accent-ink)" : "var(--text-2)" }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date + location */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Incident date</label>
          <input type="date" value={incident.date} onChange={e => set({ date: e.target.value })}
            style={{ width: "100%", height: 42, padding: "0 12px", borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Location (city, state)</label>
          <input type="text" value={incident.location} onChange={e => set({ location: e.target.value })} placeholder="Nashville, TN"
            style={{ width: "100%", height: 42, padding: "0 12px", borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Describe the damage <span style={{ color: "var(--danger)" }}>*</span></label>
        <textarea value={incident.description} onChange={e => set({ description: e.target.value })} rows={4}
          placeholder="e.g. Rear-ended a concrete barrier at low speed. Front bumper, both headlights, and hood appear damaged. Left fender has deep crease..."
          style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontSize: 14, resize: "vertical", outline: "none", lineHeight: 1.5, boxSizing: "border-box", fontFamily: "inherit" }} />
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{incident.description.length} characters · more detail improves confidence</div>
      </div>

      {/* Checkboxes */}
      <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
        {[
          { key: "airbagsDeploy", label: "Airbags deployed" },
          { key: "driveable", label: "Vehicle is driveable" },
        ].map(({ key, label }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
            <input type="checkbox" checked={incident[key as keyof IncidentDetails] as boolean}
              onChange={e => set({ [key]: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: "var(--accent)", cursor: "pointer" }} />
            {label}
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{ height: 48, padding: "0 20px", borderRadius: 12, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontWeight: 500, fontSize: 15, cursor: "pointer" }}>
          ← Back
        </button>
        <button onClick={onNext} disabled={!valid}
          style={{ flex: 1, height: 48, borderRadius: 12, border: "none", background: "var(--accent)", color: "white", fontWeight: 600, fontSize: 15, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.4 }}>
          Next: Upload photos →
        </button>
      </div>
    </div>
  );
}

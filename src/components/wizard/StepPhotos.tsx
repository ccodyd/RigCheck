"use client";

import { useRef } from "react";

const ANGLE_LABELS = [
  { key: "front", label: "Front", icon: "⬆" },
  { key: "rear", label: "Rear", icon: "⬇" },
  { key: "driver", label: "Driver side", icon: "⬅" },
  { key: "passenger", label: "Pass. side", icon: "➡" },
  { key: "damage1", label: "Damage close-up", icon: "🔍" },
  { key: "damage2", label: "Secondary damage", icon: "📸" },
];

interface Props {
  files: File[];
  setFiles: (f: File[]) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function StepPhotos({ files, setFiles, onBack, onSubmit, submitting }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    setFiles([...files, ...incoming].slice(0, 12));
  }

  function remove(i: number) {
    setFiles(files.filter((_, j) => j !== i));
  }

  const canSubmit = files.length >= 2;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em", margin: "0 0 8px" }}>Upload damage photos</h2>
        <p style={{ color: "var(--text-2)", fontSize: 15, margin: 0 }}>Minimum 2 photos · up to 12 · JPEG or HEIC preferred.</p>
      </div>

      {/* Angle guide */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
        {ANGLE_LABELS.map((a, i) => {
          const f = files[i];
          return (
            <div key={a.key} onClick={() => inputRef.current?.click()}
              style={{ aspectRatio: "4/3", borderRadius: 10, border: `1.5px dashed ${f ? "var(--success)" : "var(--border)"}`, background: f ? "var(--success-soft)" : "var(--surface)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative" }}>
              {f ? (
                <>
                  <img src={URL.createObjectURL(f)} alt={a.label} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "flex-end", padding: 6 }}>
                    <span style={{ fontSize: 11, color: "white", fontWeight: 500 }}>{a.label}</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); remove(i); }} style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: 99, border: "none", background: "rgba(0,0,0,.55)", color: "white", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 20, opacity: 0.5 }}>{a.icon}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{a.label}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />

      {files.length < 12 && (
        <button onClick={() => inputRef.current?.click()}
          style={{ width: "100%", height: 52, borderRadius: 12, border: "1.5px dashed var(--border-strong)", background: "var(--surface)", color: "var(--text-2)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>+</span> Add more photos ({files.length}/12)
        </button>
      )}

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📸 Photo tips for best accuracy</div>
        <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.8 }}>
          <li>Good lighting — daylight is best, avoid flash glare</li>
          <li>Include at least one wide shot showing full damage extent</li>
          <li>Capture VIN plate and any existing pre-damage stickers</li>
          <li>For cracks or dents, shoot from multiple angles</li>
        </ul>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onBack} style={{ height: 52, padding: "0 20px", borderRadius: 12, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text)", fontWeight: 500, fontSize: 15, cursor: "pointer" }}>
          ← Back
        </button>
        <button onClick={onSubmit} disabled={!canSubmit || submitting}
          style={{ flex: 1, height: 52, borderRadius: 12, border: "none", background: "var(--accent)", color: "white", fontWeight: 600, fontSize: 16, cursor: canSubmit && !submitting ? "pointer" : "not-allowed", opacity: canSubmit && !submitting ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {submitting ? (
            <><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span> Uploading…</>
          ) : (
            `📷 Get my free estimate (${files.length} photo${files.length !== 1 ? "s" : ""})`
          )}
        </button>
      </div>
      {!canSubmit && <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Add at least 2 photos to continue</p>}
    </div>
  );
}

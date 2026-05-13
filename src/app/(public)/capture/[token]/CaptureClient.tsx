"use client";

import { useRef, useState } from "react";

interface Props {
  estimateId: string;
  token: string;
}

const ANGLE_PROMPTS = [
  { label: "Front of vehicle", icon: "⬆", tip: "Stand 10 ft away, center the front" },
  { label: "Rear of vehicle", icon: "⬇", tip: "Show full tail, license plate visible" },
  { label: "Driver side", icon: "⬅", tip: "Full side profile, all damage visible" },
  { label: "Damage close-up", icon: "🔍", tip: "Fill the frame with the worst damage" },
  { label: "Passenger side", icon: "➡", tip: "Even if undamaged — helps AI calibrate" },
  { label: "Interior/cab", icon: "🪑", tip: "Dashboard, airbag area if deployed" },
];

export function CaptureClient({ estimateId, token }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    setFiles(prev => [...prev, ...incoming].slice(0, 12));
  }

  async function handleSubmit() {
    if (files.length < 2) return;
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const res = await fetch("/api/photos/upload", {
          method: "POST",
          headers: {
            "X-Estimate-Id": estimateId,
            "X-Filename": file.name,
            "Content-Type": file.type,
            "X-Capture-Token": token,
          },
          body: file,
        });
        if (!res.ok) throw new Error("Upload failed");
      }

      // Mark token as used & trigger analysis
      await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimateId }),
      });

      setDone(true);
    } catch {
      setError("Upload failed. Please check your connection and try again.");
      setUploading(false);
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--success-soft)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 20px" }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 10px" }}>Photos uploaded!</h2>
          <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" }}>
            {files.length} photo{files.length !== 1 ? "s" : ""} received. Your fleet manager will get the estimate shortly.
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>You can close this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>📸</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>RigCheck Photo Capture</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Upload damage photos for your estimate</div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, padding: "24px 20px 100px", maxWidth: 480, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 6px" }}>Add damage photos</h2>
          <p style={{ color: "var(--text-2)", fontSize: 14, margin: 0 }}>Tap below to take photos or select from your gallery. Min 2, max 12.</p>
        </div>

        {/* Angle prompts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {ANGLE_PROMPTS.map((a, i) => {
            const f = files[i];
            return (
              <button key={a.label} onClick={() => inputRef.current?.click()}
                style={{ aspectRatio: "4/3", borderRadius: 10, border: `1.5px dashed ${f ? "var(--success)" : "var(--border)"}`, background: f ? "var(--success-soft)" : "var(--surface)", position: "relative", overflow: "hidden", cursor: "pointer", padding: 0 }}>
                {f ? (
                  <>
                    <img src={URL.createObjectURL(f)} alt={a.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.5)", padding: "4px 8px" }}>
                      <span style={{ fontSize: 11, color: "white", fontWeight: 500 }}>{a.label}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4, padding: 8 }}>
                    <span style={{ fontSize: 24, opacity: 0.5 }}>{a.icon}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: "var(--text-2)" }}>{a.label}</span>
                    <span style={{ fontSize: 10, color: "var(--muted)", textAlign: "center", lineHeight: 1.3 }}>{a.tip}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <input ref={inputRef} type="file" accept="image/*" capture="environment" multiple onChange={handleFiles} style={{ display: "none" }} />

        {/* Thumbnails for extra files */}
        {files.length > ANGLE_PROMPTS.length && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {files.slice(ANGLE_PROMPTS.length).map((f, i) => (
              <div key={i} style={{ width: 60, height: 60, borderRadius: 8, overflow: "hidden" }}>
                <img src={URL.createObjectURL(f)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}

        {error && <p style={{ fontSize: 13, color: "var(--danger)", marginBottom: 12 }}>{error}</p>}
      </div>

      {/* Sticky submit */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px", background: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>
          <span>{files.length} photo{files.length !== 1 ? "s" : ""} added</span>
          {files.length > 0 && <button onClick={() => setFiles([])} style={{ border: "none", background: "none", color: "var(--danger)", fontSize: 12, cursor: "pointer" }}>Clear all</button>}
        </div>
        <button onClick={handleSubmit} disabled={files.length < 2 || uploading}
          style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: "var(--accent)", color: "white", fontWeight: 700, fontSize: 16, cursor: files.length >= 2 && !uploading ? "pointer" : "not-allowed", opacity: files.length >= 2 && !uploading ? 1 : 0.5 }}>
          {uploading ? "Uploading…" : `Submit ${files.length} photo${files.length !== 1 ? "s" : ""}`}
        </button>
        {files.length < 2 && <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", margin: 0 }}>Add at least 2 photos to submit</p>}
      </div>
    </div>
  );
}

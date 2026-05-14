"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { StepVehicle } from "./StepVehicle";
import { StepIncident } from "./StepIncident";
import { StepPhotos } from "./StepPhotos";
import type { VinDecodeResult, IncidentDetails } from "@/lib/types";

type Step = "vehicle" | "incident" | "photos";

const STEPS: { key: Step; label: string; num: number }[] = [
  { key: "vehicle", label: "Vehicle", num: 1 },
  { key: "incident", label: "Incident", num: 2 },
  { key: "photos", label: "Photos", num: 3 },
];

export function WizardShell() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("vehicle");
  const [vin, setVin] = useState("");
  const [vehicle, setVehicle] = useState<VinDecodeResult | null>(null);
  const [incident, setIncident] = useState<IncidentDetails>({
    type: "collision",
    description: "",
    location: "",
    date: new Date().toISOString().slice(0, 10),
    airbagsDeploy: false,
    driveable: true,
  });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const stepIdx = STEPS.findIndex(s => s.key === step);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const sessionId = crypto.randomUUID();
      // Create estimate record
      const createRes = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Guest-Session": sessionId },
        body: JSON.stringify({ vin, vehicle, incident }),
      });
      if (!createRes.ok) {
        const body = await createRes.json().catch(() => ({}));
        throw new Error(`Create estimate failed (${createRes.status}): ${body.error ?? "unknown"}`);
      }
      const { id } = await createRes.json();

      // Upload photos
      for (const file of photoFiles) {
        const uploadRes = await fetch("/api/photos/upload", {
          method: "POST",
          headers: { "X-Guest-Session": sessionId, "X-Estimate-Id": id, "X-Filename": file.name, "Content-Type": file.type },
          body: file,
        });
        if (!uploadRes.ok) {
          const body = await uploadRes.json().catch(() => ({}));
          throw new Error(`Photo upload failed (${uploadRes.status}): ${body.error ?? "unknown"}`);
        }
      }

      // Trigger AI analysis (fire-and-forget; processing page polls for result)
      fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Guest-Session": sessionId },
        body: JSON.stringify({ estimateId: id }),
      });

      // Store session for result page
      sessionStorage.setItem("guestSession", sessionId);
      router.push(`/estimate/processing?id=${id}`);
    } catch (err) {
      setSubmitting(false);
      alert("Something went wrong: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <Logo />
        <div style={{ flex: 1 }} />
        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = s.key === step;
            return (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <div style={{ width: 28, height: 1, background: done ? "var(--accent)" : "var(--border)" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: done ? "pointer" : "default" }}
                     onClick={() => done && setStep(s.key)}>
                  <div style={{ width: 24, height: 24, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, background: active ? "var(--accent)" : done ? "var(--success)" : "var(--surface-2)", color: active || done ? "white" : "var(--muted)", border: `1px solid ${active ? "var(--accent)" : done ? "var(--success)" : "var(--border)"}` }}>
                    {done ? "✓" : s.num}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "var(--text)" : "var(--text-2)" }}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
        {step === "vehicle" && (
          <StepVehicle vin={vin} setVin={setVin} vehicle={vehicle} setVehicle={setVehicle}
            onNext={() => setStep("incident")} />
        )}
        {step === "incident" && (
          <StepIncident incident={incident} setIncident={setIncident}
            onBack={() => setStep("vehicle")} onNext={() => setStep("photos")} />
        )}
        {step === "photos" && (
          <StepPhotos files={photoFiles} setFiles={setPhotoFiles}
            onBack={() => setStep("incident")} onSubmit={handleSubmit} submitting={submitting} />
        )}
      </div>
    </div>
  );
}

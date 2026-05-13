import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { IncidentDetails, VinDecodeResult } from "./types";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Zod schema for Claude's structured estimate output
export const LineItemSchema = z.object({
  part: z.string(),
  action: z.enum([
    "Replace",
    "Repair",
    "R&I + Straighten",
    "R&I + Refinish",
    "Inspect / Straighten",
    "Inspect / Replace",
    "Inspect",
    "Inspect + Align",
    "Refinish",
    "Calibrate",
    "Service",
  ]),
  severity: z.enum(["Minor", "Moderate", "Severe", "—"]),
  confidence: z.number().min(0).max(1),
  partNo: z.string(),
  partCost: z.number().min(0),
  hours: z.number().min(0),
  notes: z.string().optional(),
});

export const EstimateOutputSchema = z.object({
  severity: z.enum(["Minor", "Moderate", "Severe"]),
  headline: z.string(),
  tier1Low: z.number(),
  tier1High: z.number(),
  confidence: z.number().min(0).max(1),
  teardown: z.boolean(),
  hours: z.number(),
  laborRate: z.number(),
  lineItems: z.array(LineItemSchema),
  hotspots: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
      label: z.string(),
      severity: z.enum(["minor", "moderate", "severe"]),
    }),
  ),
  notes: z.string(),
  reasoning: z.object({
    repairVsReplace: z.string(),
    hiddenDamage: z.string(),
    adasCalibration: z.string(),
    rateLogic: z.string(),
  }),
});

export type EstimateOutput = z.infer<typeof EstimateOutputSchema>;

export async function analyzeWithClaude(
  photoUrls: string[],
  vin: VinDecodeResult,
  incident: IncidentDetails,
  laborRate: number = 149,
): Promise<EstimateOutput> {
  const systemPrompt = `You are a certified heavy-truck damage assessor with 15+ years experience on Class 3–8 vehicles.
Analyze damage photos and produce a structured repair estimate in JSON.

Key rules:
- Labor rate: $${laborRate}/hr (regional median from BLS QCEW × 3.5 for ${vin.make} ${vin.model})
- Flag teardown=true for any frame-adjacent impact (30–40% cost hidden until teardown per FMCSA)
- ADAS cameras in headlamp housings require recalibration if replaced (+$220 parts, +2.0h labor per AAA)
- Confidence scores: 0.9+ for clearly visible damage, 0.6–0.8 for suspected/obscured damage
- tier1Low/High: rough range (no line-item detail, ±30% typical)
- Line items: realistic Freightliner/Peterbilt/Kenworth/Hino part numbers where possible
- Hotspots: x/y as percentage of a 100×100 SVG front-view of the truck

Output ONLY valid JSON matching the schema. No markdown, no explanation.`;

  const userContent: Anthropic.MessageParam["content"] = [
    {
      type: "text",
      text: `Vehicle: ${vin.year} ${vin.make} ${vin.model} ${vin.trim} (VIN: ${vin.vin})
Body class: ${vin.bodyClass} | GVWR: ${vin.gvwr}
Incident: ${incident.type} on ${incident.date} | Location: ${incident.location}
Description: ${incident.description}
Airbags deployed: ${incident.airbagsDeploy} | Driveable: ${incident.driveable}

Analyze the ${photoUrls.length} attached photo(s) and produce a detailed estimate.`,
    },
  ];

  // Add photos as image content blocks
  for (const url of photoUrls.slice(0, 20)) {
    userContent.push({
      type: "image",
      source: {
        type: "url",
        url,
      },
    });
  }

  userContent.push({
    type: "text",
    text: `Respond with JSON only, matching this TypeScript schema:
{
  severity: "Minor" | "Moderate" | "Severe",
  headline: string,           // Short damage description
  tier1Low: number,           // Low end of rough range
  tier1High: number,          // High end of rough range
  confidence: number,         // 0–1 overall
  teardown: boolean,
  hours: number,              // Total labor hours
  laborRate: number,          // $/hr used
  lineItems: [{
    part: string,
    action: "Replace" | "Repair" | "R&I + Straighten" | "R&I + Refinish" | "Inspect / Straighten" | "Inspect / Replace" | "Inspect" | "Inspect + Align" | "Refinish" | "Calibrate" | "Service",
    severity: "Minor" | "Moderate" | "Severe" | "—",
    confidence: number,
    partNo: string,           // OEM part number or "—"
    partCost: number,         // 0 if labor-only
    hours: number,
  }],
  hotspots: [{ x: number, y: number, label: string, severity: "minor"|"moderate"|"severe" }],
  notes: string,              // Overall assessment paragraph
  reasoning: {
    repairVsReplace: string,
    hiddenDamage: string,
    adasCalibration: string,
    rateLogic: string,
  }
}`,
  });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip any accidental markdown fences
  const json = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  const parsed = JSON.parse(json);
  return EstimateOutputSchema.parse(parsed);
}

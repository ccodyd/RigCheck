import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { analyzeWithClaude } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  const { estimateId } = await request.json();
  if (!estimateId) return NextResponse.json({ error: "Missing estimateId" }, { status: 400 });

  const service = await createServiceClient();

  // Fetch estimate + photos + vehicle
  const { data: estimate, error: estErr } = await service
    .from("estimates")
    .select("*, estimate_photos(storage_path), vehicles(vin, year, make, model, trim, gvwr)")
    .eq("id", estimateId)
    .single();

  if (estErr || !estimate) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
  }

  // Get signed photo URLs
  const photos = estimate.estimate_photos ?? [];
  const photoUrls: string[] = [];
  for (const p of photos) {
    const { data: signed } = await service.storage
      .from("photos")
      .createSignedUrl(p.storage_path, 3600);
    if (signed?.signedUrl) photoUrls.push(signed.signedUrl);
  }

  // Mark as processing
  await service.from("estimates").update({ status: "processing" }).eq("id", estimateId);

  try {
    const incident = {
      type: estimate.incident_type,
      description: estimate.incident_description,
      location: estimate.incident_location,
      date: estimate.incident_date,
      airbagsDeploy: estimate.airbags_deploy,
      driveable: estimate.driveable,
    };

    const result = await analyzeWithClaude(
      photoUrls,
      estimate.vehicles?.vin ?? "",
      incident,
      149
    );

    // Insert line items
    if (result.lineItems.length > 0) {
      const lineItemRows = result.lineItems.map(li => ({
        estimate_id: estimateId,
        part: li.part,
        action: li.action,
        severity: li.severity,
        confidence: li.confidence,
        part_no: li.partNo,
        part_cost: li.partCost,
        hours: li.hours,
        labor_rate: result.laborRate,
      }));
      await service.from("estimate_line_items").insert(lineItemRows);
    }

    // Update estimate with results
    await service.from("estimates").update({
      status: "ready",
      tier1_low: result.tier1Low,
      tier1_high: result.tier1High,
      severity: result.severity,
      confidence: result.confidence,
      teardown: result.teardown,
      headline: result.headline,
      labor_rate: result.laborRate,
      notes: result.notes,
      hotspots: result.hotspots,
      reasoning: result.reasoning,
    }).eq("id", estimateId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("AI analyze error:", err);
    await service.from("estimates").update({ status: "error" }).eq("id", estimateId);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

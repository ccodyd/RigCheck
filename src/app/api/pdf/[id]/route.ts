import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateEstimatePdf } from "@/lib/pdf";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const service = await createServiceClient();

  const { data: estimate, error } = await service
    .from("estimates")
    .select("*, estimate_line_items(*), estimate_photos(*), vehicles(*)")
    .eq("id", id)
    .single();

  if (error || !estimate) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (estimate.tier !== "tier2") return NextResponse.json({ error: "Tier 2 required" }, { status: 403 });

  const pdfBytes = await generateEstimatePdf(estimate);

  return new NextResponse(new Uint8Array(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rigcheck-${estimate.estimate_number ?? id}.pdf"`,
    },
  });
}

export async function POST(_: NextRequest, { params }: Params) {
  // Called by webhook to pre-generate PDF (fire-and-forget)
  const { id } = await params;
  const service = await createServiceClient();

  const { data: estimate, error } = await service
    .from("estimates")
    .select("*, estimate_line_items(*), estimate_photos(*), vehicles(*)")
    .eq("id", id)
    .single();

  if (error || !estimate) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await generateEstimatePdf(estimate);
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { twilioClient, TWILIO_FROM } from "@/lib/twilio";
import { createServiceClient } from "@/lib/supabase/server";
import { createHash, randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  const { estimateId, phone } = await request.json();
  if (!estimateId || !phone) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const service = await createServiceClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Generate secure token
  const token = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { error: dbErr } = await service.from("capture_tokens").insert({
    estimate_id: estimateId,
    token: hash,
    expires_at: expiresAt,
  });

  if (dbErr) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const captureUrl = `${appUrl}/capture/${token}`;

  try {
    await twilioClient.messages.create({
      body: `RigCheck: Upload damage photos here (link expires in 48h): ${captureUrl}`,
      from: TWILIO_FROM,
      to: phone,
    });
  } catch (err) {
    console.error("Twilio error:", err);
    return NextResponse.json({ error: "SMS failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

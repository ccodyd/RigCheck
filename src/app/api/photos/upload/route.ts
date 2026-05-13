import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  const estimateId = request.headers.get("X-Estimate-Id");
  const guestSession = request.headers.get("X-Guest-Session");
  const filename = request.headers.get("X-Filename") ?? "photo.jpg";
  const contentType = request.headers.get("Content-Type") ?? "image/jpeg";

  if (!estimateId) return NextResponse.json({ error: "Missing estimate ID" }, { status: 400 });

  const buffer = await request.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const hash = createHash("sha256").update(bytes).digest("hex");

  const ext = filename.split(".").pop() ?? "jpg";
  const storagePath = `estimates/${estimateId}/${hash}.${ext}`;

  const service = await createServiceClient();

  // Upload to Supabase Storage
  const { error: uploadError } = await service.storage
    .from("photos")
    .upload(storagePath, bytes, { contentType, upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // Record in DB
  const { error: dbError } = await service.from("estimate_photos").insert({
    estimate_id: estimateId,
    storage_path: storagePath,
    hash,
    guest_session_id: guestSession,
  });

  if (dbError) {
    console.error("Photo DB error:", dbError);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ path: storagePath }, { status: 201 });
}

import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { createHash } from "crypto";
import { CaptureClient } from "./CaptureClient";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata = {
  title: "Upload Damage Photos — RigCheck",
  description: "Upload photos of the vehicle damage for your estimate.",
};

export default async function CapturePage({ params }: Props) {
  const { token } = await params;
  const service = await createServiceClient();

  const hash = createHash("sha256").update(token).digest("hex");

  const { data: captureToken } = await service
    .from("capture_tokens")
    .select("*, estimates(id, status)")
    .eq("token", hash)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!captureToken) notFound();

  return <CaptureClient estimateId={captureToken.estimate_id} token={token} />;
}

import { notFound } from "next/navigation";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import { ResultClient } from "./ResultClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EstimateResultPage({ params }: Props) {
  const { id } = await params;

  const [supabase, service] = await Promise.all([
    createServerClient(),
    createServiceClient(),
  ]);

  const [{ data: { user } }, { data: estimate }] = await Promise.all([
    supabase.auth.getUser(),
    service
      .from("estimates")
      .select(`*, estimate_line_items(*), estimate_photos(*), vehicles(*)`)
      .eq("id", id)
      .single(),
  ]);

  if (!estimate) notFound();

  return <ResultClient estimate={estimate} userId={user?.id ?? null} />;
}

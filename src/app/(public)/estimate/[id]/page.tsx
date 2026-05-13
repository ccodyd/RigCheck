import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ResultClient } from "./ResultClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EstimateResultPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const { data: estimate } = await supabase
    .from("estimates")
    .select(`*, estimate_line_items(*), estimate_photos(*), vehicles(*)`)
    .eq("id", id)
    .single();

  if (!estimate) notFound();

  return <ResultClient estimate={estimate} />;
}

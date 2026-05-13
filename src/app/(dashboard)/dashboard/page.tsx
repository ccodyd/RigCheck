import { createServerClient, createServiceClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata = { title: "Dashboard — RigCheck" };

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const service = await createServiceClient();
  const { data: profile } = await service.from("users").select("org_id, full_name").eq("id", user!.id).single();

  const orgId = profile?.org_id;

  const [{ data: estimates }, { data: vehicles }] = await Promise.all([
    service.from("estimates")
      .select("id, estimate_number, status, tier, severity, tier1_low, tier1_high, confidence, created_at, vehicles(year, make, model)")
      .eq("org_id", orgId ?? "")
      .order("created_at", { ascending: false })
      .limit(50),
    service.from("vehicles")
      .select("id, vin, year, make, model")
      .eq("org_id", orgId ?? "")
      .limit(20),
  ]);

  const stats = {
    total: estimates?.length ?? 0,
    pending: estimates?.filter(e => e.status === "pending" || e.status === "processing").length ?? 0,
    ready: estimates?.filter(e => e.status === "ready").length ?? 0,
    tier2: estimates?.filter(e => e.tier === "tier2").length ?? 0,
  };

  return <DashboardClient estimates={estimates ?? []} vehicles={vehicles ?? []} stats={stats} userName={profile?.full_name ?? user!.email ?? "Fleet manager"} />;
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const guestSession = request.headers.get("X-Guest-Session");
  const body = await request.json();
  const { vin, vehicle, incident } = body;

  if (!vin || !vehicle || !incident) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const service = await createServiceClient();
  let orgId: string | null = null;
  let vehicleId: string | null = null;

  // If authenticated user, resolve org
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await service.from("users").select("org_id").eq("id", user.id).single();
      orgId = profile?.org_id ?? null;
    }
  } catch {
    // guest
  }

  // Upsert vehicle if we have a VIN
  if (vin) {
    const { data: v, error: vErr } = await service.from("vehicles").insert({
      vin,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim,
      org_id: orgId,
    }).select("id").single();
    if (vErr) console.error("Vehicle insert error:", vErr);
    vehicleId = v?.id ?? null;
  }

  const { data: estimate, error } = await service.from("estimates").insert({
    org_id: orgId,
    vehicle_id: vehicleId,
    guest_session_id: guestSession,
    tier: "tier1",
    status: "pending",
    incident_type: incident.type,
    incident_description: incident.description,
    incident_location: incident.location,
    incident_date: incident.date,
    airbags_deploy: incident.airbagsDeploy,
    driveable: incident.driveable,
  }).select("id").single();

  if (error || !estimate) {
    console.error("Estimate insert error:", error);
    return NextResponse.json({ error: error?.message ?? "DB error" }, { status: 500 });
  }

  return NextResponse.json({ id: estimate.id }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const guestSession = request.headers.get("X-Guest-Session");
  const service = await createServiceClient();

  let query = service.from("estimates").select("id, status, tier, tier1_low, tier1_high, severity, created_at").order("created_at", { ascending: false }).limit(20);

  if (guestSession) {
    query = query.eq("guest_session_id", guestSession);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json(data);
}

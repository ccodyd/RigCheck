import { NextRequest, NextResponse } from "next/server";
import type { VinDecodeResult } from "@/lib/types";

export async function GET(request: NextRequest) {
  const vin = request.nextUrl.searchParams.get("vin");
  if (!vin || vin.length !== 17) {
    return NextResponse.json({ error: "Invalid VIN" }, { status: 400 });
  }

  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) {
    return NextResponse.json({ error: "NHTSA API unavailable" }, { status: 502 });
  }

  const json = await res.json();
  const r = json.Results?.[0];
  if (!r || r.ErrorCode !== "0") {
    return NextResponse.json({ error: "VIN not found" }, { status: 404 });
  }

  const gvwr = r.GVWR ? parseInt(r.GVWR.replace(/[^0-9]/g, ""), 10) || undefined : undefined;

  const result: VinDecodeResult = {
    vin,
    year: parseInt(r.ModelYear, 10) || undefined,
    make: r.Make || undefined,
    model: r.Model || undefined,
    trim: r.Trim || r.Series || undefined,
    vehicleType: r.VehicleType || undefined,
    gvwr,
    engine: r.DisplacementL ? `${r.DisplacementL}L ${r.FuelTypePrimary ?? ""}`.trim() : undefined,
    bodyClass: r.BodyClass || undefined,
  };

  return NextResponse.json(result);
}

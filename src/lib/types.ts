export type Severity = "Minor" | "Moderate" | "Severe";
export type EstimateTier = "tier1" | "tier2";
export type EstimateStatus =
  | "draft"
  | "photos_pending"
  | "processing"
  | "ready"
  | "sent_to_shop"
  | "quote_received"
  | "approved"
  | "repair_complete"
  | "closed";

export interface LineItem {
  id: string;
  part: string;
  action: string;
  severity: string;
  confidence: number;
  partNo: string;
  partCost: number;
  hours: number;
  laborRate: number;
}

export interface Hotspot {
  x: number;
  y: number;
  label: string;
  severity: "minor" | "moderate" | "severe";
}

export interface Estimate {
  id: string;
  rcNumber: string;
  vehicleId: string | null;
  orgId: string | null;
  guestSessionId: string | null;
  tier: EstimateTier;
  status: EstimateStatus;
  severity: Severity | null;
  headline: string | null;
  tier1Low: number | null;
  tier1High: number | null;
  tier2Total: number | null;
  confidence: number | null;
  teardown: boolean;
  hours: number | null;
  laborRate: number;
  notes: string | null;
  stripePaymentId: string | null;
  lineItems: LineItem[];
  photos: EstimatePhoto[];
  hotspots: Hotspot[];
  // joined vehicle info
  vehicle?: Vehicle;
  createdAt: string;
}

export interface EstimatePhoto {
  id: string;
  estimateId: string;
  storagePath: string;
  publicUrl?: string;
  angleLabel: string;
  hash: string | null;
  gps: string | null;
  capturedAt: string;
}

export interface Vehicle {
  id: string;
  orgId: string | null;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  fleetId: string | null;
  odometer: number | null;
  gvwr: string | null;
  bodyClass: string | null;
  color: string | null;
  silhouette: "tractor" | "box";
}

export interface Organization {
  id: string;
  name: string;
  plan: "free" | "owner_op" | "small_fleet" | "mid_fleet" | "enterprise";
  stripeCustomerId: string | null;
}

export interface Shop {
  id: string;
  name: string;
  city: string;
  rating: number;
  rate: number;
  distance: number;
}

export interface VinDecodeResult {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  bodyClass?: string;
  gvwr?: number;
  vehicleType?: string;
  engine?: string;
}

export interface IncidentDetails {
  type: string;
  description: string;
  location: string;
  date: string;
  airbagsDeploy: boolean;
  driveable: boolean;
}

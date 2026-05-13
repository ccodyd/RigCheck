"use client";

import { TruckSilhouette } from "@/components/shared/TruckSilhouette";
import type { Hotspot } from "@/lib/types";

interface Props {
  hotspots: Hotspot[];
  kind?: "tractor" | "box";
}

export function DamageMap({ hotspots, kind = "tractor" }: Props) {
  return (
    <div style={{ background: "var(--surface-2)", borderRadius: 12, padding: 12, height: 220 }}>
      <TruckSilhouette kind={kind} hotspots={hotspots} interactive />
    </div>
  );
}

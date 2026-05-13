"use client";

import { useState } from "react";
import type { Hotspot } from "@/lib/types";

interface Props {
  kind?: "tractor" | "box";
  hotspots?: Hotspot[];
  interactive?: boolean;
}

export function TruckSilhouette({ kind = "tractor", hotspots = [], interactive = false }: Props) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const stroke = "var(--text-2)";

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="cab-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--surface-2)" />
          <stop offset="1" stopColor="var(--surface-3)" />
        </linearGradient>
        <pattern id="grille" width="2" height="2" patternUnits="userSpaceOnUse">
          <path d="M0 1h2" stroke="var(--border-strong)" strokeWidth=".4" />
        </pattern>
      </defs>

      {kind === "tractor" ? (
        <g>
          <path d="M14 24 Q 50 14 86 24 L 86 56 Q 50 50 14 56 Z" fill="url(#cab-g)" stroke={stroke} strokeWidth=".6"/>
          <path d="M22 24 Q 50 16 78 24 L 70 30 Q 50 24 30 30 Z" fill="var(--surface-3)" stroke={stroke} strokeWidth=".5" opacity=".6"/>
          <rect x="30" y="38" width="40" height="12" rx="1.5" fill="url(#grille)" stroke={stroke} strokeWidth=".5"/>
          <rect x="46" y="32" width="8" height="5" rx="1" fill="var(--surface-3)" stroke={stroke} strokeWidth=".4"/>
          <rect x="14" y="34" width="14" height="9" rx="2" fill="var(--surface)" stroke={stroke} strokeWidth=".6"/>
          <rect x="72" y="34" width="14" height="9" rx="2" fill="var(--surface)" stroke={stroke} strokeWidth=".6"/>
          <circle cx="21" cy="38.5" r="2" fill="var(--surface-3)"/>
          <circle cx="79" cy="38.5" r="2" fill="var(--surface-3)"/>
          <rect x="10" y="64" width="80" height="11" rx="2" fill="var(--surface-3)" stroke={stroke} strokeWidth=".6"/>
          <rect x="20" y="68" width="4" height="3" rx=".6" fill="var(--surface-2)" stroke={stroke} strokeWidth=".4"/>
          <rect x="76" y="68" width="4" height="3" rx=".6" fill="var(--surface-2)" stroke={stroke} strokeWidth=".4"/>
          <path d="M10 56 Q 10 70 20 75" fill="none" stroke={stroke} strokeWidth=".6"/>
          <path d="M90 56 Q 90 70 80 75" fill="none" stroke={stroke} strokeWidth=".6"/>
          <path d="M4 88 H 96" stroke="var(--border)" strokeWidth=".5" strokeDasharray="2 2"/>
          <rect x="34" y="68" width="6" height="3" rx=".6" fill="var(--surface)" stroke={stroke} strokeWidth=".4"/>
          <rect x="60" y="68" width="6" height="3" rx=".6" fill="var(--surface)" stroke={stroke} strokeWidth=".4"/>
        </g>
      ) : (
        <g>
          <rect x="8" y="40" width="32" height="32" rx="2.5" fill="url(#cab-g)" stroke={stroke} strokeWidth=".6"/>
          <rect x="40" y="22" width="50" height="50" rx="2" fill="var(--surface-2)" stroke={stroke} strokeWidth=".6"/>
          <rect x="12" y="44" width="22" height="14" rx="1.5" fill="var(--surface-3)" stroke={stroke} strokeWidth=".5"/>
          <rect x="12" y="60" width="22" height="8" rx="1" fill="url(#grille)" stroke={stroke} strokeWidth=".4"/>
          <rect x="8" y="55" width="4" height="6" rx="1" fill="var(--surface)" stroke={stroke} strokeWidth=".4"/>
          <path d="M44 26v44M52 26v44M88 26v44" stroke="var(--border-strong)" strokeWidth=".4" />
          <circle cx="18" cy="78" r="6" fill="var(--surface-3)" stroke={stroke} strokeWidth=".6"/>
          <circle cx="68" cy="78" r="6" fill="var(--surface-3)" stroke={stroke} strokeWidth=".6"/>
          <circle cx="82" cy="78" r="6" fill="var(--surface-3)" stroke={stroke} strokeWidth=".6"/>
          <path d="M4 88 H 96" stroke="var(--border)" strokeWidth=".5" strokeDasharray="2 2"/>
        </g>
      )}

      {hotspots.map((h, i) => {
        const sev = h.severity || "minor";
        const c = sev === "severe" ? "var(--danger)" : sev === "moderate" ? "oklch(0.7 0.16 60)" : "var(--info)";
        const active = activeId === i;
        return (
          <g key={i} style={{ cursor: interactive ? "pointer" : "default" }}
             onClick={() => interactive && setActiveId(active ? null : i)}>
            <circle cx={h.x} cy={h.y} r="4.5" fill={c} fillOpacity={active ? 0.95 : 0.5} stroke={c} strokeWidth=".8">
              <animate attributeName="r" values="3.2;5.5;3.2" dur={`${2.2 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values=".25;.7;.25" dur={`${2.2 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={h.x} cy={h.y} r="1.4" fill="white"/>
            {active && (
              <g>
                <rect x={Math.min(h.x + 2, 70)} y={Math.max(h.y - 8, 2)} width="28" height="6" rx="1.5"
                      fill="var(--surface)" stroke="var(--border-strong)" strokeWidth=".4"/>
                <text x={Math.min(h.x + 2, 70) + 14} y={Math.max(h.y - 8, 2) + 4.2} fontSize="2.6"
                      textAnchor="middle" fill="var(--text)" fontFamily="system-ui" fontWeight="500">
                  {h.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

import Link from "next/link";

export function Logo({ size = 24 }: { size?: number }) {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "inherit" }}>
      <div style={{
        width: size + 6, height: size + 6, borderRadius: 8,
        background: "var(--accent)", color: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 1px 0 rgba(255,255,255,.2) inset, 0 2px 6px -2px rgba(20,16,8,.3)"
      }}>
        <svg width={size - 2} height={size - 2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h13l4 4v4h-2"/><circle cx="8" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M3 9v8h3"/>
        </svg>
      </div>
      <div style={{ fontWeight: 600, letterSpacing: "-0.01em", fontSize: 16 }}>
        RigCheck<span style={{ color: "var(--muted)", fontWeight: 500 }}>.ai</span>
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";

const navLinks = ["How it works", "Sample report", "Pricing", "FAQ"];

export function LandingNav() {
  const router = useRouter();
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(12px)",
      background: "color-mix(in oklch, var(--bg) 80%, transparent)",
      borderBottom: "1px solid var(--border)"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 24 }}>
        <Logo />
        <nav style={{ display: "flex", gap: 22, marginLeft: 28, fontSize: 13.5 }}>
          {navLinks.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
               style={{ color: "var(--text-2)", textDecoration: "none", fontWeight: 500 }}>{l}</a>
          ))}
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/sign-in" style={{
            display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px",
            borderRadius: 10, border: "1px solid var(--border-strong)", background: "var(--surface)",
            color: "var(--text)", fontSize: 13, fontWeight: 500, textDecoration: "none"
          }}>Sign in</Link>
          <Link href="/estimate" style={{
            display: "inline-flex", alignItems: "center", gap: 8, height: 36, padding: "0 14px",
            borderRadius: 10, border: "none", background: "var(--accent)",
            color: "white", fontSize: 13, fontWeight: 500, textDecoration: "none",
            boxShadow: "0 1px 0 rgba(255,255,255,.18) inset, 0 1px 2px rgba(20,16,8,.18)"
          }}>
            Free estimate →
          </Link>
        </div>
      </div>
    </header>
  );
}

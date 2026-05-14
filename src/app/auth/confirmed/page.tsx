import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function EmailConfirmedPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <Logo />
        <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--success-soft)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "28px auto 20px" }}>✓</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", margin: "0 0 10px" }}>Email confirmed!</h1>
        <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.6, margin: "0 0 32px" }}>
          Your account is ready. Head to your dashboard to view reports or start a new estimate.
        </p>
        <Link
          href="/dashboard"
          style={{ display: "inline-block", height: 44, lineHeight: "44px", padding: "0 28px", borderRadius: 10, background: "var(--accent)", color: "white", fontWeight: 600, fontSize: 15, textDecoration: "none" }}
        >
          Go to dashboard →
        </Link>
        <p style={{ marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
          Or{" "}
          <Link href="/estimate" style={{ color: "var(--accent)", textDecoration: "none" }}>start a free estimate</Link>
        </p>
      </div>
    </div>
  );
}

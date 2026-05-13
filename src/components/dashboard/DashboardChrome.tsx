"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/Logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "My Reports", icon: "📋" },
];

export function DashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
          <Logo />
        </div>

        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, marginBottom: 2, background: active ? "var(--accent-soft)" : "transparent", color: active ? "var(--accent-ink)" : "var(--text-2)", fontWeight: active ? 600 : 400, fontSize: 13.5, textDecoration: "none", transition: "background .15s" }}>
                <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
          <Link href="/estimate" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 36, borderRadius: 8, background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            + New Estimate
          </Link>
          <form action="/api/auth/sign-out" method="POST" style={{ marginTop: 8 }}>
            <button type="submit" style={{ width: "100%", height: 32, borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: 12, cursor: "pointer" }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}

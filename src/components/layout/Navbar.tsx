"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Profile", path: "/profile" },
    { name: "Post Project", path: "/projects/new" },
  ];

  return (
    <nav className="glass-panel" style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "var(--spacing-md) var(--spacing-xl)",
      margin: "var(--spacing-md)",
      borderRadius: "var(--radius-full)",
      position: "relative",
      zIndex: 100,
      transform: "translateZ(0)"
    }}>
      
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
        {pathname !== "/dashboard" && pathname !== "/" && (
          <button 
            onClick={() => router.back()} 
            className="btn btn-outline" 
            style={{ 
              padding: "4px 8px", fontSize: "0.8rem", borderRadius: "var(--radius-md)",
              display: "flex", alignItems: "center", gap: "4px"
            }}
          >
            ← Back
          </button>
        )}
        <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
          <Link href="/dashboard" style={{ color: "var(--color-text-primary)" }}>
            Team<span className="text-gradient">Up</span>
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--spacing-lg)", alignItems: "center" }}>
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link 
              key={link.name} 
              href={link.path}
              style={{ 
                color: isActive ? "var(--color-brand-primary)" : "var(--color-text-secondary)",
                fontWeight: isActive ? "600" : "500"
              }}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "var(--spacing-md)", alignItems: "center" }}>
        <NotificationBell />
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: "var(--spacing-xs) var(--spacing-md)", fontSize: "0.875rem" }}>
          Log Out
        </button>
      </div>
      
    </nav>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-lg)" }}>
      
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "450px", padding: "var(--spacing-2xl)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "var(--spacing-xs)" }}>Welcome Back</h1>
          <p style={{ color: "var(--color-text-secondary)" }}>Log in to your TeamUp account</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: "rgba(239, 68, 68, 0.1)", 
            color: "var(--color-danger)", 
            padding: "var(--spacing-sm)", 
            borderRadius: "var(--radius-md)", 
            marginBottom: "var(--spacing-md)",
            border: "1px solid var(--color-danger)",
            fontSize: "0.875rem"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <div>
            <label className="input-label" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              className="input-field" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: "100%", marginTop: "var(--spacing-sm)" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "var(--spacing-lg)", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ fontWeight: "500" }}>
            Sign up
          </Link>
        </div>

      </div>

    </div>
  );
}

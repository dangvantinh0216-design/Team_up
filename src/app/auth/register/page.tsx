"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-lg)" }}>
      
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "450px", padding: "var(--spacing-2xl)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "var(--spacing-xs)" }}>Create Account</h1>
          <p style={{ color: "var(--color-text-secondary)" }}>Join TeamUp to find your squad</p>
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

        {success ? (
          <div style={{ textAlign: "center", color: "var(--color-text-primary)" }}>
            <div style={{ 
              backgroundColor: "rgba(16, 185, 129, 0.1)", 
              color: "var(--color-success)", 
              padding: "var(--spacing-md)", 
              borderRadius: "var(--radius-md)", 
              marginBottom: "var(--spacing-lg)",
              border: "1px solid var(--color-success)"
            }}>
              Registration successful! Please check your email to verify your account.
            </div>
            <Link href="/auth/login" className="btn btn-outline" style={{ width: "100%" }}>
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            <div>
              <label className="input-label" htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName"
                className="input-field" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: "100%", marginTop: "var(--spacing-sm)" }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        )}

        {!success && (
          <div style={{ textAlign: "center", marginTop: "var(--spacing-lg)", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ fontWeight: "500" }}>
              Log in
            </Link>
          </div>
        )}

      </div>

    </div>
  );
}

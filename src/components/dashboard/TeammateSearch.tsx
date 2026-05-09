"use client";

import { useState } from "react";
import Link from "next/link";
import ReliabilityHistory from "./ReliabilityHistory";

type Profile = {
  id: string;
  full_name: string;
  skills: string;
  reliability_score: number;
};

export default function TeammateSearch({ profiles }: { profiles: Profile[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.skills?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <input 
          type="text" 
          placeholder="Search by name or skills (e.g. React, Python)..." 
          className="input-field"
          style={{ padding: "12px 20px", fontSize: "1rem" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--spacing-md)" }}>
        {filteredProfiles.length === 0 ? (
          <div className="glass-panel" style={{ 
            gridColumn: "1/-1", padding: "var(--spacing-2xl)", textAlign: "center", 
            display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-md)"
          }}>
            <div style={{ fontSize: "3rem" }}>🔍</div>
            <h3 style={{ margin: 0 }}>No teammates found</h3>
            <p style={{ color: "var(--color-text-muted)", maxWidth: "400px" }}>
              Try adjusting your search terms or look for common skills like &quot;React&quot; or &quot;Python&quot;.
            </p>
            <button onClick={() => setSearchTerm("")} className="btn btn-outline">Clear Search</button>
          </div>
        ) : (
          filteredProfiles.map(p => (
            <div key={p.id} className="glass-panel card-hover" style={{ padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ 
                width: "60px", height: "60px", borderRadius: "50%", 
                background: "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))", 
                marginBottom: "var(--spacing-sm)",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.5rem", color: "white"
              }}>
                {p.full_name?.charAt(0)}
              </div>
              <h4 style={{ margin: "0 0 4px 0" }}>{p.full_name}</h4>
              <div style={{ 
                fontSize: "0.75rem", fontWeight: "bold", padding: "2px 8px", borderRadius: "var(--radius-full)",
                background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", marginBottom: "var(--spacing-sm)",
                cursor: "pointer"
              }} onClick={() => setExpandedHistory(expandedHistory === p.id ? null : p.id)}>
                Score: {p.reliability_score || 100} {expandedHistory === p.id ? "▲" : "▼"}
              </div>

              {expandedHistory === p.id && (
                <div className="animate-fade-in" style={{ width: "100%", marginBottom: "var(--spacing-md)", textAlign: "left" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "bold", marginBottom: "8px", opacity: 0.6 }}>LỊCH SỬ UY TÍN:</div>
                  <ReliabilityHistory userId={p.id} />
                </div>
              )}

              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--spacing-lg)", height: "40px", overflow: "hidden" }}>
                {p.skills || "No skills listed"}
              </p>
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <Link href={`/profile/${p.id}`} className="btn btn-outline" style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}>
                  Profile
                </Link>
                <button 
                  onClick={() => setExpandedHistory(expandedHistory === p.id ? null : p.id)}
                  className="btn btn-outline" 
                  style={{ flex: 1, padding: "8px", fontSize: "0.85rem" }}
                >
                  History
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

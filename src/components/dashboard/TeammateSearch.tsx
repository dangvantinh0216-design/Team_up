"use client";

import { useState } from "react";
import Link from "next/link";

type Profile = {
  id: string;
  full_name: string;
  skills: string;
  reliability_score: number;
};

export default function TeammateSearch({ profiles }: { profiles: Profile[] }) {
  const [searchTerm, setSearchTerm] = useState("");

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
          <div className="glass-panel" style={{ gridColumn: "1/-1", padding: "var(--spacing-xl)", textAlign: "center", color: "var(--color-text-muted)" }}>
            No teammates found matching your search.
          </div>
        ) : (
          filteredProfiles.map(p => (
            <div key={p.id} className="glass-panel" style={{ padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ 
                width: "60px", height: "60px", borderRadius: "50%", 
                background: "var(--color-brand-primary)", marginBottom: "var(--spacing-sm)",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.5rem"
              }}>
                {p.full_name?.charAt(0)}
              </div>
              <h4 style={{ margin: "0 0 4px 0" }}>{p.full_name}</h4>
              <p style={{ color: "var(--color-success)", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "var(--spacing-sm)" }}>
                Score: {p.reliability_score || 100}
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--spacing-lg)", height: "40px", overflow: "hidden" }}>
                {p.skills || "No skills listed"}
              </p>
              <Link href={`/profile/${p.id}`} className="btn btn-outline" style={{ width: "100%", padding: "8px", fontSize: "0.85rem" }}>
                View Profile
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

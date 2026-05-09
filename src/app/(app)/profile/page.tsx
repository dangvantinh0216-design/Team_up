"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", maxWidth: "800px", margin: "0 auto" }}>
      
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h2>Complete Your <span className="text-gradient">Profile</span></h2>
        <p style={{ color: "var(--color-text-secondary)" }}>The more details you provide, the better our AI can match you with the right team.</p>
      </div>

      {success && (
        <div style={{ 
          backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", padding: "var(--spacing-md)", 
          borderRadius: "var(--radius-md)", marginBottom: "var(--spacing-lg)", border: "1px solid var(--color-success)"
        }}>
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
        
        <div>
          <label className="input-label" htmlFor="skills">Tech Stack & Skills (comma separated)</label>
          <input type="text" id="skills" className="input-field" placeholder="React, Node.js, Python, UI/UX" required />
        </div>

        <div>
          <label className="input-label" htmlFor="freetime">Weekly Free Time (Hours)</label>
          <input type="number" id="freetime" className="input-field" placeholder="10" required />
        </div>

        <div>
          <label className="input-label" htmlFor="vibe">Describe your Teamwork &quot;Vibe&quot;</label>
          <textarea id="vibe" className="input-field" rows={4} placeholder="I prefer asynchronous communication, love pair programming on weekends, and take code reviews seriously..." required></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </form>

    </div>
  );
}

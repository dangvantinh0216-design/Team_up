"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", maxWidth: "800px", margin: "0 auto" }}>
      
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h2>Post a <span className="text-gradient">New Project</span></h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Describe your idea and let AI find the perfect teammates for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
        
        <div>
          <label className="input-label" htmlFor="title">Project Title</label>
          <input type="text" id="title" className="input-field" placeholder="e.g. NextGen Study Platform" required />
        </div>

        <div>
          <label className="input-label" htmlFor="description">Project Description</label>
          <textarea id="description" className="input-field" rows={5} placeholder="Describe the problem, the solution, and what stage you are currently at..." required></textarea>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
          <div>
            <label className="input-label" htmlFor="tech">Target Tech Stack</label>
            <input type="text" id="tech" className="input-field" placeholder="Next.js, Supabase" required />
          </div>
          <div>
            <label className="input-label" htmlFor="roles">Roles Needed</label>
            <input type="text" id="roles" className="input-field" placeholder="Frontend, UI/UX Designer" required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "var(--spacing-sm)" }}>
          {loading ? "Posting..." : "Post Project & Find Teammates"}
        </button>

      </form>

    </div>
  );
}

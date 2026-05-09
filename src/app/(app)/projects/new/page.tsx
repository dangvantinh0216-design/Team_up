"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [rolesNeeded, setRolesNeeded] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { error: insertError } = await supabase.from('projects').insert({
      owner_id: user.id,
      title,
      description,
      tech_stack: techStack,
      roles_needed: rolesNeeded,
    });

    setLoading(false);

    if (insertError) {
      setErrorMsg(insertError.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)", maxWidth: "800px", margin: "0 auto" }}>
      
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h2>Post a <span className="text-gradient">New Project</span></h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Describe your idea and let AI find the perfect teammates for you.</p>
      </div>

      {errorMsg && (
        <div style={{ 
          backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--color-danger)", padding: "var(--spacing-md)", 
          borderRadius: "var(--radius-md)", marginBottom: "var(--spacing-lg)", border: "1px solid var(--color-danger)"
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
        
        <div>
          <label className="input-label" htmlFor="title">Project Title</label>
          <input 
            type="text" id="title" className="input-field" placeholder="e.g. NextGen Study Platform" 
            value={title} onChange={e => setTitle(e.target.value)} required 
          />
        </div>

        <div>
          <label className="input-label" htmlFor="description">Project Description</label>
          <textarea 
            id="description" className="input-field" rows={5} placeholder="Describe the problem, the solution, and what stage you are currently at..." 
            value={description} onChange={e => setDescription(e.target.value)} required
          ></textarea>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
          <div>
            <label className="input-label" htmlFor="tech">Target Tech Stack</label>
            <input 
              type="text" id="tech" className="input-field" placeholder="Next.js, Supabase" 
              value={techStack} onChange={e => setTechStack(e.target.value)} required 
            />
          </div>
          <div>
            <label className="input-label" htmlFor="roles">Roles Needed</label>
            <input 
              type="text" id="roles" className="input-field" placeholder="Frontend, UI/UX Designer" 
              value={rolesNeeded} onChange={e => setRolesNeeded(e.target.value)} required 
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "var(--spacing-sm)" }}>
          {loading ? "Posting to Database..." : "Post Project & Find Teammates"}
        </button>

      </form>

    </div>
  );
}

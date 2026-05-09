"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [skills, setSkills] = useState("");
  const [freeTime, setFreeTime] = useState("");
  const [vibe, setVibe] = useState("");

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setSkills(data.skills || "");
          setFreeTime(data.free_time ? data.free_time.toString() : "");
          setVibe(data.work_style || "");
        }
      }
      setFetching(false);
    }
    loadProfile();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      skills,
      free_time: parseInt(freeTime) || 0,
      work_style: vibe,
      full_name: user.email?.split('@')[0],
      reliability_score: 100 // default
    });

    setLoading(false);

    if (upsertError) {
      setErrorMsg(upsertError.message);
    } else {
      setSuccess(true);
      router.refresh();
      // Remove success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (fetching) return <div style={{ paddingTop: "var(--spacing-xl)", textAlign: "center" }}>Loading your profile...</div>;

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
          Profile updated successfully! Check your Dashboard.
        </div>
      )}

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
          <label className="input-label" htmlFor="skills">Tech Stack & Skills (comma separated)</label>
          <input 
            type="text" id="skills" className="input-field" 
            placeholder="React, Node.js, Python, UI/UX" 
            value={skills} onChange={e => setSkills(e.target.value)}
            required 
          />
        </div>

        <div>
          <label className="input-label" htmlFor="freetime">Weekly Free Time (Hours)</label>
          <input 
            type="number" id="freetime" className="input-field" 
            placeholder="10" 
            value={freeTime} onChange={e => setFreeTime(e.target.value)}
            required 
          />
        </div>

        <div>
          <label className="input-label" htmlFor="vibe">Describe your Teamwork &quot;Vibe&quot;</label>
          <textarea 
            id="vibe" className="input-field" rows={4} 
            placeholder="I prefer asynchronous communication, love pair programming on weekends, and take code reviews seriously..." 
            value={vibe} onChange={e => setVibe(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving to Database..." : "Save Profile"}
        </button>

      </form>

    </div>
  );
}

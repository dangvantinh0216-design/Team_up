"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function GitHubLinker({ projectId, currentRepo }: { projectId: string, currentRepo: string | null }) {
  const [repo, setRepo] = useState(currentRepo || "");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Clean URL if user pasted full URL
    const cleanedRepo = repo.replace("https://github.com/", "").replace(/\/$/, "");
    
    const { error } = await supabase
      .from('projects')
      .update({ github_repo: cleanedRepo })
      .eq('id', projectId);

    if (!error) {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLink} style={{ display: "flex", gap: "var(--spacing-xs)", alignItems: "center" }}>
      <input 
        type="text" 
        className="input-field" 
        style={{ padding: "6px 12px", fontSize: "0.8rem", width: "180px", height: "32px" }}
        placeholder="e.g. facebook/react"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <button type="submit" className="btn btn-outline" style={{ padding: "0 12px", fontSize: "0.8rem", height: "32px" }} disabled={loading}>
        {loading ? "Linking..." : "Link GitHub"}
      </button>
    </form>
  );
}

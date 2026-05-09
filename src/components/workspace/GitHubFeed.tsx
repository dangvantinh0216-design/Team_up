"use client";

import { useState, useEffect } from "react";

type Commit = {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    avatar_url: string;
  };
};

export default function GitHubFeed({ repoUrl }: { repoUrl: string | null }) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoUrl) return;

    async function fetchCommits() {
      setLoading(true);
      setError(null);
      try {
        // repoUrl should be "owner/repo"
        const response = await fetch(`https://api.github.com/repos/${repoUrl}/commits?per_page=5`);
        if (!response.ok) throw new Error("Could not fetch GitHub activity");
        const data = await response.json();
        setCommits(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, [repoUrl]);

  if (!repoUrl) return null;

  return (
    <div className="glass-panel" style={{ padding: "var(--spacing-md)", marginTop: "var(--spacing-lg)" }}>
      <h4 style={{ marginBottom: "var(--spacing-md)", display: "flex", alignItems: "center", gap: "8px", fontSize: "1rem" }}>
        <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        GitHub Activity
      </h4>

      {loading && <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>Loading commits...</p>}
      {error && <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>Error: {error}</p>}
      
      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          {commits.length === 0 && <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>No activity found.</p>}
          {commits.map(c => (
            <div key={c.sha} style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "flex-start", padding: "var(--spacing-xs) 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <img src={c.author?.avatar_url} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%" }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.85rem", margin: 0, fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.commit.message.split('\n')[0]}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", margin: 0 }}>
                  {c.commit.author.name} • {new Date(c.commit.author.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

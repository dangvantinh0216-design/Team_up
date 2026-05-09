import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/workspace/KanbanBoard";
import TeamChat from "@/components/workspace/TeamChat";
import GitHubLinker from "@/components/workspace/GitHubLinker";
import GitHubFeed from "@/components/workspace/GitHubFeed";

export const dynamic = 'force-dynamic';

export default async function WorkspacePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch project details
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.id).single();

  if (!project) {
    return <div className="container" style={{ paddingTop: "var(--spacing-xl)", textAlign: "center" }}>Project not found.</div>;
  }
  
  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-md)", height: "calc(100vh - 100px)", display: "flex", flexDirection: "column" }}>
      
      <div style={{ marginBottom: "var(--spacing-md)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: "var(--spacing-xs)" }}>{project.title} <span style={{ fontSize: "1rem", color: "var(--color-text-secondary)", fontWeight: "normal" }}>Workspace</span></h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", margin: 0, maxWidth: "600px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.description}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <GitHubLinker projectId={project.id} currentRepo={project.github_repo} />
          <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(99, 102, 241, 0.1)", color: "var(--color-brand-primary)", padding: "2px 10px", borderRadius: "100px" }}>
            Live Sync Enabled
          </span>
        </div>
      </div>

      <div className="workspace-grid" style={{ flex: 1 }}>
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <KanbanBoard projectId={project.id} userId={user.id} />
        </div>
        <div style={{ minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <TeamChat projectId={project.id} userId={user.id} />
          </div>
          <GitHubFeed repoUrl={project.github_repo} />
        </div>
      </div>

    </div>
  );
}

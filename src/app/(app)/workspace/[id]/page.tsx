import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/workspace/KanbanBoard";
import TeamChat from "@/components/workspace/TeamChat";

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
      
      <div style={{ marginBottom: "var(--spacing-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ marginBottom: "var(--spacing-xs)" }}>{project.title} <span style={{ fontSize: "1rem", color: "var(--color-text-secondary)", fontWeight: "normal" }}>Workspace</span></h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", margin: 0 }}>{project.description}</p>
        </div>
        <div>
          <span style={{ fontSize: "0.85rem", backgroundColor: "rgba(99, 102, 241, 0.1)", color: "var(--color-brand-primary)", padding: "4px 12px", borderRadius: "100px" }}>
            Live Sync Enabled
          </span>
        </div>
      </div>

      <div className="workspace-grid">
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <KanbanBoard projectId={project.id} userId={user.id} />
        </div>
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <TeamChat projectId={project.id} userId={user.id} />
        </div>
      </div>

    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

type ProjectDisplay = {
  id: string;
  title: string;
  description: string;
  role: string;
};

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!profile) notFound();

  // Fetch projects this user has participated in (approved member)
  const { data: memberships } = await supabase
    .from('project_members')
    .select('projects(*)')
    .eq('user_id', params.id)
    .eq('status', 'approved');

  // Fetch projects this user owns
  const { data: ownedProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', params.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allProjects: ProjectDisplay[] = [
    ...((ownedProjects as unknown as ProjectDisplay[]) || []).map(p => ({ id: p.id, title: p.title, description: p.description, role: 'Owner' })),
    ...((memberships as unknown as any[]) || []).filter(m => m.projects).map(m => ({ id: m.projects.id, title: m.projects.title, description: m.projects.description, role: 'Member' }))
  ];

  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)" }}>
      
      <div className="glass-panel" style={{ 
        padding: "var(--spacing-2xl)", 
        display: "flex", 
        gap: "var(--spacing-2xl)", 
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>
        
        {/* Left Side: Avatar & Basic Info */}
        <div style={{ textAlign: "center", width: "280px", flexShrink: 0 }}>
          <div style={{ 
            width: "140px", height: "140px", borderRadius: "50%", 
            background: "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))", 
            margin: "0 auto var(--spacing-lg)", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            fontSize: "4rem", fontWeight: "bold", color: "white",
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)"
          }}>
            {profile.full_name?.charAt(0) || "U"}
          </div>
          
          <h2 style={{ marginBottom: "var(--spacing-xs)" }}>{profile.full_name}</h2>
          
          <div style={{ 
            display: "inline-block", 
            padding: "4px 16px", 
            borderRadius: "var(--radius-full)", 
            background: "rgba(16, 185, 129, 0.1)", 
            color: "var(--color-success)",
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginBottom: "var(--spacing-xl)"
          }}>
            🌟 Reliability Score: {profile.reliability_score || 100}
          </div>

          <button className="btn btn-primary" style={{ width: "100%", padding: "12px", borderRadius: "var(--radius-lg)" }}>
            Connect with {profile.full_name?.split(' ')[0]}
          </button>
        </div>

        {/* Right Side: Details */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <h4 style={{ color: "var(--color-brand-primary)", marginBottom: "var(--spacing-md)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Bio & Work Style
            </h4>
            <p style={{ lineHeight: "1.8", color: "var(--color-text-secondary)", fontSize: "1.05rem" }}>
              {profile.work_style || "This user hasn't set their work style yet."}
            </p>
          </div>

          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <h4 style={{ color: "var(--color-brand-primary)", marginBottom: "var(--spacing-md)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Core Skills
            </h4>
            <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap" }}>
              {profile.skills?.split(',').map((s: string) => (
                <span key={s} style={{ 
                  backgroundColor: "rgba(255,255,255,0.05)", 
                  padding: "6px 16px", 
                  borderRadius: "var(--radius-md)", 
                  fontSize: "0.9rem",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  {s.trim()}
                </span>
              )) || <p style={{ color: "var(--color-text-muted)" }}>No skills listed.</p>}
            </div>
          </div>

          <div>
            <h4 style={{ color: "var(--color-brand-primary)", marginBottom: "var(--spacing-md)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Experience Portfolio
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "var(--spacing-md)" }}>
              {allProjects.length === 0 ? (
                <p style={{ color: "var(--color-text-muted)", gridColumn: "1/-1" }}>No projects completed yet.</p>
              ) : (
                allProjects.map((p) => (
                  <div key={p.id} className="glass-panel card-hover" style={{ 
                    padding: "var(--spacing-md)", 
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    transition: "transform 0.2s"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <p style={{ fontWeight: "600", fontSize: "1rem", margin: 0 }}>{p.title}</p>
                      <span style={{ fontSize: "0.7rem", opacity: 0.6, background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                        {p.role}
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: "0.85rem", 
                      color: "var(--color-text-secondary)", 
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      marginBottom: "0"
                    }}>
                      {p.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

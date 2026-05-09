import { createClient } from "@/utils/supabase/server";
import { calculateMatchScore, UserProfile, ProjectData } from "@/utils/matchingAlgorithm";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch user's profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  // 1.5 Fetch user's own projects
  const { data: myProjects } = await supabase.from('projects').select('*').eq('owner_id', user.id);

  // 2. Fetch all projects (we exclude user's own projects from recommendations)
  const { data: allProjects } = await supabase.from('projects').select('*').neq('owner_id', user.id);

  // 3. Run Matching Algorithm
  const matchedProjects = (allProjects || []).map((project: ProjectData & { id: string, title: string }) => {
    const score = calculateMatchScore(profile as UserProfile | null, project as ProjectData);
    return { ...project, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore); // Sắp xếp điểm cao lên đầu

  const profileComplete = !!profile?.skills;

  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)" }}>
      
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h2>Welcome back, <span className="text-gradient">{profile?.full_name || user.email?.split('@')[0]}</span> 👋</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Ready to build something amazing today?</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--spacing-xl)", alignItems: "start" }}>
        
        {/* Left Column: Profile & My Workspaces */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
            <h3 style={{ marginBottom: "var(--spacing-md)" }}>Your Profile</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
              <p><strong>Reliability Score:</strong> <span style={{ color: "var(--color-success)" }}>{profile?.reliability_score || 100}</span></p>
              <p><strong>Skills:</strong> <span style={{ color: "var(--color-text-secondary)" }}>{profile?.skills || "Not set yet"}</span></p>
              <p><strong>Vibe:</strong> <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>{profile?.work_style ? profile.work_style.substring(0, 50) + "..." : "Not set yet"}</span></p>
            </div>
            <a href="/profile" className="btn btn-outline" style={{ width: "100%", textAlign: "center" }}>
              {profileComplete ? "Edit Profile" : "Complete Profile"}
            </a>
          </div>

          <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
            <h3 style={{ marginBottom: "var(--spacing-md)" }}>My Workspaces</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              {(!myProjects || myProjects.length === 0) ? (
                 <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>No projects yet.</p>
              ) : (
                myProjects.map((p: { id: string, title: string }) => (
                  <a key={p.id} href={`/workspace/${p.id}`} className="btn btn-outline" style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", width: "100%", fontSize: "0.9rem", color: "var(--color-text-primary)", borderColor: "rgba(255,255,255,0.1)" }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                    <span>→</span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Project Feed */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
            <h3>Recommended Projects</h3>
            {!profileComplete && (
              <span style={{ fontSize: "0.85rem", color: "var(--color-warning)" }}>Complete your profile for better AI matches!</span>
            )}
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            
            {matchedProjects.length === 0 ? (
              <div className="glass-panel" style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--color-text-secondary)" }}>
                No projects found. Be the first to post a project!
              </div>
            ) : (
              matchedProjects.map(p => (
                <div key={p.id} className="glass-panel" style={{ padding: "var(--spacing-lg)", transition: "transform var(--transition-fast)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--spacing-xs)" }}>
                    <h4 style={{ color: "var(--color-brand-primary)", margin: 0 }}>{p.title}</h4>
                    {/* Badge AI Match Score */}
                    <div style={{ 
                      backgroundColor: p.matchScore >= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: p.matchScore >= 80 ? 'var(--color-success)' : 'var(--color-warning)',
                      padding: "4px 8px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: "bold",
                      border: `1px solid ${p.matchScore >= 80 ? 'var(--color-success)' : 'var(--color-warning)'}`
                    }}>
                      {p.matchScore}% Match
                    </div>
                  </div>
                  
                  <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--spacing-md)", fontSize: "0.95rem" }}>
                    {p.description}
                  </p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.8rem", backgroundColor: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px" }}>
                        Tech: {p.tech_stack}
                      </span>
                      <span style={{ fontSize: "0.8rem", backgroundColor: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px" }}>
                        Looking for: {p.roles_needed}
                      </span>
                    </div>
                    <button className="btn btn-primary" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>Apply</button>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

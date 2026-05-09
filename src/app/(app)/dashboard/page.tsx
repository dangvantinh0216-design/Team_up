import { createClient } from "@/utils/supabase/server";
import { calculateMatchScore, UserProfile, ProjectData } from "@/utils/matchingAlgorithm";
import DashboardContent from "@/components/dashboard/DashboardContent";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Fetch user's profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  // 1.5 Fetch user's own projects (Owner)
  const { data: myProjects } = await supabase.from('projects').select('*').eq('owner_id', user.id);

  // 1.7 Fetch projects where user is an approved member
  const { data: memberships } = await supabase
    .from('project_members')
    .select('project_id, status, projects(*)')
    .eq('user_id', user.id);

  const approvedMemberProjects = (memberships || [])
    .filter(m => m.status === 'approved' && m.projects)
    .map(m => m.projects);

  const allMyWorkspaces = [
    ...(myProjects || []).map(p => ({ ...p, role: 'Owner' })),
    ...approvedMemberProjects.map(p => ({ ...p, role: 'Member' }))
  ];

  // 2. Fetch all projects (exclude user's own projects)
  const { data: allProjects } = await supabase.from('projects').select('*').neq('owner_id', user.id);

  // 3. Fetch all other profiles for search
  const { data: allProfiles } = await supabase.from('profiles').select('*').neq('id', user.id);

  // 4. Run Matching Algorithm for projects
  const matchedProjects = (allProjects || []).map((project: ProjectData & { id: string, title: string, owner_id: string }) => {
    const score = calculateMatchScore(profile as UserProfile | null, project as ProjectData);
    const membership = (memberships || []).find(m => m.project_id === project.id);
    return { ...project, matchScore: score, membershipStatus: membership?.status || null };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const profileComplete = !!profile?.skills;

  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)" }}>
      
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h2>Welcome back, <span className="text-gradient">{profile?.full_name || user.email?.split('@')[0]}</span> 👋</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Ready to build something amazing today?</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--spacing-2xl)", alignItems: "start" }}>
        
        {/* Left Column: Profile & My Workspaces */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
            <h3 style={{ marginBottom: "var(--spacing-md)" }}>Your Profile</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
              <p><strong>Reliability Score:</strong> <span style={{ color: "var(--color-success)" }}>{profile?.reliability_score || 100}</span></p>
              <p><strong>Skills:</strong> <span style={{ color: "var(--color-text-secondary)" }}>{profile?.skills || "Not set yet"}</span></p>
              <p><strong>Vibe:</strong> <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>{profile?.work_style ? (profile.work_style.length > 50 ? profile.work_style.substring(0, 50) + "..." : profile.work_style) : "Not set yet"}</span></p>
            </div>
            <a href="/profile" className="btn btn-outline" style={{ width: "100%", textAlign: "center" }}>
              {profileComplete ? "Edit Profile" : "Complete Profile"}
            </a>
          </div>

          <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
            <h3 style={{ marginBottom: "var(--spacing-md)" }}>My Workspaces</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              {allMyWorkspaces.length === 0 ? (
                 <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>No projects yet.</p>
              ) : (
                allMyWorkspaces.map((p) => (
                  <a key={p.id} href={`/workspace/${p.id}`} className="btn btn-outline" style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", width: "100%", fontSize: "0.9rem", color: "var(--color-text-primary)", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "600" }}>{p.title}</span>
                      <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{p.role}</span>
                    </div>
                    <span>→</span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard Tabs (Projects / Teammates) */}
        <div>
          <DashboardContent 
            matchedProjects={matchedProjects} 
            allProfiles={allProfiles || []} 
            userId={user.id}
            profileComplete={profileComplete}
          />
        </div>

      </div>

    </div>
  );
}

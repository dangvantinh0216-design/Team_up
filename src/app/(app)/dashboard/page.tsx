import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Ở Phase 2, chúng ta lấy mock data trước khi kết nối DB thật (hoặc sẽ fetch trực tiếp từ DB)
  const mockProjects = [
    { id: 1, title: "AI Study Buddy", desc: "Building a Next.js app that helps students summarize lectures.", roles: "Frontend, AI Engineer" },
    { id: 2, title: "Game Server Analytics", desc: "Need a backend dev to process lots of data in Go.", roles: "Backend Developer" }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)" }}>
      
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h2>Welcome back, <span className="text-gradient">{user?.email?.split('@')[0] || 'Developer'}</span> 👋</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Ready to build something amazing today?</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--spacing-xl)", alignItems: "start" }}>
        
        {/* Left Column: Profile Summary */}
        <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
          <h3 style={{ marginBottom: "var(--spacing-md)" }}>Your Profile</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
            <p><strong>Reliability Score:</strong> <span style={{ color: "var(--color-success)" }}>100</span></p>
            <p><strong>Skills:</strong> <span style={{ color: "var(--color-text-secondary)" }}>Not set yet</span></p>
            <p><strong>Vibe:</strong> <span style={{ color: "var(--color-text-secondary)" }}>Not set yet</span></p>
          </div>
          <a href="/profile" className="btn btn-primary" style={{ width: "100%", textAlign: "center" }}>
            Complete Profile
          </a>
        </div>

        {/* Right Column: Project Feed */}
        <div>
          <h3 style={{ marginBottom: "var(--spacing-md)" }}>Recommended Projects</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            
            {mockProjects.map(p => (
              <div key={p.id} className="glass-panel" style={{ padding: "var(--spacing-lg)", transition: "transform var(--transition-fast)" }}>
                <h4 style={{ color: "var(--color-brand-primary)", marginBottom: "var(--spacing-xs)" }}>{p.title}</h4>
                <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--spacing-md)", fontSize: "0.95rem" }}>
                  {p.desc}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", backgroundColor: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px" }}>
                    Looking for: {p.roles}
                  </span>
                  <button className="btn btn-outline" style={{ padding: "4px 12px", fontSize: "0.85rem" }}>View</button>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
}

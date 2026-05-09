import Link from "next/link";

export default function Home() {
  return (
    <main className="container flex-center" style={{ minHeight: "100vh", flexDirection: "column" }}>
      
      {/* Hero Section */}
      <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-2xl)", textAlign: "center", maxWidth: "800px" }}>
        
        <h1 style={{ fontSize: "3rem", marginBottom: "var(--spacing-md)" }}>
          Find Your Perfect <span className="text-gradient">Team</span>.
          <br /> Build Amazing <span className="text-gradient">Projects</span>.
        </h1>
        
        <p style={{ color: "var(--color-text-secondary)", fontSize: "1.25rem", marginBottom: "var(--spacing-xl)" }}>
          The ultimate platform for developers and students to find teammates based on skills, goals, and teamwork vibes. Stop ghosting, start shipping.
        </p>
        
        <div style={{ display: "flex", gap: "var(--spacing-md)", justifyContent: "center" }}>
          <Link href="/auth/register" className="btn btn-primary delay-100 animate-fade-in">
            Get Started
          </Link>
          <Link href="/auth/login" className="btn btn-outline delay-200 animate-fade-in">
            Log In
          </Link>
        </div>
        
      </div>

      {/* Features Grid */}
      <div className="animate-fade-in delay-300" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "var(--spacing-lg)", 
        marginTop: "var(--spacing-2xl)",
        width: "100%"
      }}>
        
        <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
          <h3 style={{ color: "var(--color-brand-primary)" }}>🤖 AI Matchmaking</h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
            Our algorithm analyzes your skills and working style to find the most compatible teammates.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
          <h3 style={{ color: "var(--color-brand-secondary)" }}>💼 Smart Workspaces</h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
            Every project gets a dedicated workspace with Kanban boards, team chat, and GitHub integration.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
          <h3 style={{ color: "var(--color-success)" }}>⭐ Reliability Score</h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}>
            Build your reputation. Points are awarded for completing tasks, pushing code, and peer reviews.
          </p>
        </div>

      </div>

    </main>
  );
}

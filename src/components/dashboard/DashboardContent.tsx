"use client";

import { useState } from "react";
import ApplyButton from "./ApplyButton";
import TeammateSearch from "./TeammateSearch";
import EmptyState from "../ui/EmptyState";

import { MatchResult } from "@/utils/matchingAlgorithm";

type MatchedProject = {
  id: string;
  title: string;
  description: string;
  tech_stack: string;
  roles_needed: string;
  matchResult: MatchResult;
  owner_id: string;
  membershipStatus: string | null;
};

type Profile = {
  id: string;
  full_name: string;
  skills: string;
  reliability_score: number;
};

export default function DashboardContent({ 
  matchedProjects, 
  allProfiles, 
  userId, 
  profileComplete 
}: { 
  matchedProjects: MatchedProject[], 
  allProfiles: Profile[], 
  userId: string,
  profileComplete: boolean
}) {
  const [activeTab, setActiveTab] = useState<'projects' | 'teammates'>('projects');
  const [showExplanation, setShowExplanation] = useState<string | null>(null);

  return (
    <div>
      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "var(--spacing-md)", marginBottom: "var(--spacing-xl)", borderBottom: "1px solid var(--color-border)", paddingBottom: "2px" }}>
        <button 
          onClick={() => setActiveTab('projects')}
          className="hover-glow"
          style={{ 
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "1.1rem", fontWeight: "600",
            color: activeTab === 'projects' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'projects' ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
            transition: "all 0.2s",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0"
          }}
        >
          Recommended Projects
        </button>
        <button 
          onClick={() => setActiveTab('teammates')}
          className="hover-glow"
          style={{ 
            padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "1.1rem", fontWeight: "600",
            color: activeTab === 'teammates' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'teammates' ? '3px solid var(--color-brand-primary)' : '3px solid transparent',
            transition: "all 0.2s",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0"
          }}
        >
          Find Teammates
        </button>
      </div>

      {activeTab === 'projects' ? (
        <div className="animate-fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
            <h3 style={{ margin: 0 }}>Projects for You</h3>
            {!profileComplete && (
              <span style={{ fontSize: "0.85rem", color: "var(--color-warning)" }}>Complete your profile for better AI matches!</span>
            )}
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            {matchedProjects.length === 0 ? (
              <EmptyState 
                title="No projects found" 
                description="Be the first to post a project and find your dream team!"
                actionText="Create a Project"
                actionHref="/projects/new"
                icon="🚀"
              />
            ) : (
              matchedProjects.map(p => (
                <div key={p.id} className="glass-panel card-hover" style={{ padding: "var(--spacing-lg)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--spacing-xs)" }}>
                    <h4 style={{ color: "var(--color-brand-primary)", margin: 0 }}>{p.title}</h4>
                    <div 
                      onClick={() => setShowExplanation(showExplanation === p.id ? null : p.id)}
                      style={{ 
                        backgroundColor: p.matchResult.score >= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: p.matchResult.score >= 80 ? 'var(--color-success)' : 'var(--color-warning)',
                        padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: "bold",
                        border: `1px solid ${p.matchResult.score >= 80 ? 'var(--color-success)' : 'var(--color-warning)'}`,
                        cursor: "help"
                      }}
                    >
                      {p.matchResult.score}% Match ✨
                    </div>
                  </div>
                  
                  {showExplanation === p.id && (
                    <div className="animate-fade-in" style={{ 
                      padding: "10px", 
                      backgroundColor: "rgba(99, 102, 241, 0.05)", 
                      borderRadius: "var(--radius-md)", 
                      fontSize: "0.85rem", 
                      marginBottom: "var(--spacing-md)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      color: "var(--color-text-primary)"
                    }}>
                      <div style={{ fontWeight: "bold", marginBottom: "4px", color: "var(--color-brand-primary)" }}>AI Insight:</div>
                      {p.matchResult.explanation}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px", opacity: 0.8 }}>
                        <span>Skills: {p.matchResult.breakdown.skills}%</span>
                        <span>Vibe: {p.matchResult.breakdown.vibe}%</span>
                        <span>Time: {p.matchResult.breakdown.availability}%</span>
                        <span>Reliability: {p.matchResult.breakdown.reliability}%</span>
                      </div>
                    </div>
                  )}

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
                    <ApplyButton projectId={p.id} userId={userId} ownerId={p.owner_id} initialStatus={p.membershipStatus} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <TeammateSearch profiles={allProfiles} />
      )}
    </div>
  );
}

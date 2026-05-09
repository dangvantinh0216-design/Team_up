"use client";

import { useState } from "react";
import TeamChat from "./TeamChat";
import GitHubFeed from "./GitHubFeed";
import MemberManager from "./MemberManager";

export default function WorkspaceSidebar({ projectId, userId, githubRepo, isOwner }: { projectId: string, userId: string, githubRepo: string | null, isOwner: boolean }) {
  const [activeTab, setActiveTab] = useState<'chat' | 'github' | 'members'>('chat');

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "var(--spacing-md)" }}>
      {/* Tab Switcher - Premium Style */}
      <div style={{ 
        display: "flex", gap: "4px", padding: "4px", 
        background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)" 
      }}>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{ 
            flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-md)", 
            fontSize: "0.8rem", cursor: "pointer",
            background: activeTab === 'chat' ? 'var(--color-brand-primary)' : 'transparent',
            color: activeTab === 'chat' ? 'white' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'chat' ? '600' : '500',
            transition: "all var(--transition-fast)",
            whiteSpace: "nowrap"
          }}
        >
          💬 Chat
        </button>
        <button 
          onClick={() => setActiveTab('github')}
          style={{ 
            flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-md)", 
            fontSize: "0.8rem", cursor: "pointer",
            background: activeTab === 'github' ? 'var(--color-brand-primary)' : 'transparent',
            color: activeTab === 'github' ? 'white' : 'var(--color-text-secondary)',
            fontWeight: activeTab === 'github' ? '600' : '500',
            transition: "all var(--transition-fast)",
            whiteSpace: "nowrap"
          }}
        >
          🐙 GitHub
        </button>
        {isOwner && (
          <button 
            onClick={() => setActiveTab('members')}
            style={{ 
              flex: 1, padding: "10px", border: "none", borderRadius: "var(--radius-md)", 
              fontSize: "0.8rem", cursor: "pointer",
              background: activeTab === 'members' ? 'var(--color-brand-primary)' : 'transparent',
              color: activeTab === 'members' ? 'white' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'members' ? '600' : '500',
              transition: "all var(--transition-fast)",
              whiteSpace: "nowrap"
            }}
          >
            👥 Team
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {activeTab === 'chat' && <TeamChat projectId={projectId} userId={userId} />}
        {activeTab === 'github' && (
          <div style={{ height: "100%" }}>
            <GitHubFeed repoUrl={githubRepo} isFullHeight={true} />
          </div>
        )}
        {activeTab === 'members' && isOwner && <MemberManager projectId={projectId} />}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/ToastContext";
import TeamChat from "./TeamChat";
import GitHubFeed from "./GitHubFeed";
import MemberManager from "./MemberManager";

export default function WorkspaceSidebar({ projectId, userId, githubRepo, isOwner }: { projectId: string, userId: string, githubRepo: string | null, isOwner: boolean }) {
  const [activeTab, setActiveTab] = useState<'chat' | 'github' | 'members'>('chat');
  const [isDeleting, setIsDeleting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const handleDeleteProject = async () => {
    const confirmed = confirm("⚠️ CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN dự án này? Toàn bộ dữ liệu sẽ bị mất.");
    
    if (!confirmed) return;

    setIsDeleting(true);
    showToast("Đang thực hiện xóa toàn bộ dữ liệu dự án...", "info");
    
    try {
      // 1. Xóa các bảng liên quan (Manual cleanup)
      const tables = ['tasks', 'messages', 'notifications', 'project_members'];
      for (const table of tables) {
        const { error: tableErr } = await supabase.from(table).delete().eq('project_id', projectId);
        if (tableErr) {
          console.warn(`Warning deleting from ${table}:`, tableErr);
          // Tiếp tục cố gắng xóa các bảng khác
        }
      }
      
      // 2. Xóa chính dự án
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error("Final project delete error:", error);
        showToast(`Lỗi xóa dự án: ${error.message}`, "error");
        setIsDeleting(false);
      } else {
        showToast("Dự án đã được xóa sạch hoàn toàn! ✅", "success");
        // Ép buộc quay về Dashboard và xóa cache
        setTimeout(() => {
          window.location.replace('/dashboard');
        }, 1000);
      }
    } catch (err: unknown) {
      console.error("Critical delete error:", err);
      showToast("Lỗi hệ thống nghiêm trọng khi xóa.", "error");
      setIsDeleting(false);
    }
  };

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
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {activeTab === 'chat' && <TeamChat projectId={projectId} userId={userId} />}
        {activeTab === 'github' && (
          <div style={{ height: "100%" }}>
            <GitHubFeed repoUrl={githubRepo} isFullHeight={true} />
          </div>
        )}
        {activeTab === 'members' && <MemberManager projectId={projectId} isOwner={isOwner} />}
      </div>

      {/* Admin Actions */}
      {isOwner && (
        <div style={{ paddingTop: "var(--spacing-md)", borderTop: "1px solid var(--color-border)" }}>
          <button 
            onClick={handleDeleteProject}
            disabled={isDeleting}
            style={{ 
              width: "100%", padding: "10px", background: "none", border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "var(--color-danger)", borderRadius: "var(--radius-md)", fontSize: "0.8rem",
              cursor: "pointer", transition: "all 0.2s", fontWeight: "500"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "none"}
          >
            {isDeleting ? "Deleting..." : "🗑️ Delete Project"}
          </button>
        </div>
      )}
    </div>
  );
}

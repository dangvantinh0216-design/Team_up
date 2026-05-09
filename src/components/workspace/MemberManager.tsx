"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastContext";

type Applicant = {
  id: string;
  user_id: string;
  status: string;
  profiles: { full_name: string, skills: string } | null;
};

type ProjectOwner = {
  id: string;
  full_name: string;
};

import { createPortal } from "react-dom";
import MemberPenaltyModal from "./MemberPenaltyModal";

export default function MemberManager({ projectId, isOwner }: { projectId: string, isOwner: boolean }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [ownerInfo, setOwnerInfo] = useState<ProjectOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [removingMember, setRemovingMember] = useState<{id: string, name: string, userId: string} | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch Owner Info
    const { data: project } = await supabase
      .from('projects')
      .select('owner_id, profiles(full_name)')
      .eq('id', projectId)
      .single();
    
    if (project) {
      // Explicitly handle the joined profiles type
      const profiles = project.profiles as unknown as { full_name: string } | null;
      setOwnerInfo({
        id: project.owner_id,
        full_name: profiles?.full_name || "Project Owner"
      });
    }

    // 2. Fetch Applicants/Members
    const { data } = await supabase
      .from('project_members')
      .select('id, user_id, status, profiles(full_name, skills)')
      .eq('project_id', projectId);
    
    if (data) {
      setApplicants(data as unknown as Applicant[]);
    }
    setLoading(false);
  };

  const handleAction = async (applicationId: string, userId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('project_members')
      .update({ status: newStatus })
      .eq('id', applicationId);

    if (!error) {
      await supabase.from('notifications').insert({
        user_id: userId,
        actor_id: currentUserId,
        type: 'approval',
        content: `Your application has been ${newStatus === 'approved' ? 'accepted' : 'rejected'}.`,
        project_id: projectId
      });

      showToast(`Member ${newStatus === 'approved' ? 'accepted' : 'rejected'}!`, "info");
      fetchData();
    }
  };

  const handleRemoveMember = async (applicationId: string, userId: string, fullName: string, reason: string, detailedReason: string, penaltyPoints: number) => {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', applicationId);

    if (!error) {
      // Apply penalty and save history
      if (penaltyPoints > 0) {
        // 1. Get current score
        const { data: profile } = await supabase.from('profiles').select('reliability_score').eq('id', userId).single();
        const currentScore = profile?.reliability_score || 100;
        const newScore = Math.max(0, currentScore - penaltyPoints);

        // 2. Update profile score
        await supabase.from('profiles').update({ reliability_score: newScore }).eq('id', userId);
        
        // 3. Save to history table
        await supabase.from('reliability_history').insert({
          user_id: userId,
          project_id: projectId,
          points_changed: -penaltyPoints,
          reason: reason,
          detailed_reason: detailedReason,
          actor_id: currentUserId
        });

        // 4. Send notification
        await supabase.from('notifications').insert({
          user_id: userId,
          actor_id: currentUserId,
          type: 'penalty',
          content: `You have been removed from the project for: ${reason}. Penalty: -${penaltyPoints} reliability points.`,
          project_id: projectId
        });
      }

      showToast(`Removed ${fullName}. ${penaltyPoints > 0 ? `Penalty of ${penaltyPoints} points applied.` : ""}`, "success");
      setRemovingMember(null);
      fetchData();
    } else {
      showToast("Error removing member.", "error");
    }
  };

  const pending = applicants.filter(a => a.status === 'pending');
  const members = applicants.filter(a => a.status === 'approved' && a.user_id !== ownerInfo?.id);

  if (loading) return <div>Loading team...</div>;

  return (
    <div className="glass-panel" style={{ 
      padding: "var(--spacing-lg)", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden" // Parent doesn't scroll, child does
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-lg)", flexShrink: 0 }}>
        <h3 style={{ margin: 0 }}>Team Management</h3>
        <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>DB Records: {applicants.length}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }} className="custom-scrollbar">
        {isOwner && (
          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <h4 style={{ fontSize: "0.9rem", color: "var(--color-warning)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-warning)" }}></span>
              Pending Applications ({pending.length})
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              {pending.length === 0 ? (
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", padding: "var(--spacing-md)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)" }}>
                  No pending applications.
                </p>
              ) : (
                pending.map(a => (
                  <div key={a.id} className="glass-panel" style={{ padding: "var(--spacing-md)", background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                    <div>
                      <Link href={`/profile/${a.user_id}`} style={{ fontWeight: "600", fontSize: "1rem", color: "var(--color-brand-primary)" }}>
                        {a.profiles?.full_name || "New Applicant"}
                      </Link>
                      <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{a.profiles?.skills || "No skills listed"}</p>
                    </div>
                    <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                      <button onClick={() => handleAction(a.id, a.user_id, 'approved')} className="btn btn-primary" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>Approve</button>
                      <button onClick={() => handleAction(a.id, a.user_id, 'rejected')} className="btn btn-outline" style={{ padding: "4px 12px", fontSize: "0.8rem", color: "var(--color-danger)" }}>Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div>
          <h4 style={{ fontSize: "0.9rem", color: "var(--color-success)", textTransform: "uppercase" }}>
            Current Members ({members.length + (ownerInfo ? 1 : 0)})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            
            {/* Always show Owner first */}
            {ownerInfo && (
              <div className="glass-panel" style={{ padding: "var(--spacing-md)", background: "rgba(99, 102, 241, 0.05)", border: "1px solid rgba(99, 102, 241, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem", color: "white" }}>
                    {ownerInfo.full_name.charAt(0)}
                  </div>
                  <div>
                    <Link href={`/profile/${ownerInfo.id}`} style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--color-brand-primary)" }}>
                      {ownerInfo.full_name}
                    </Link>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Project Owner 👑</p>
                  </div>
                </div>
              </div>
            )}

            {/* Show Approved Members */}
            {members.map(a => (
              <div key={a.id} className="glass-panel" style={{ padding: "var(--spacing-md)", background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-brand-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem" }}>
                    {a.profiles?.full_name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <Link href={`/profile/${a.user_id}`} style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--color-text-primary)" }}>
                      {a.profiles?.full_name || "Team Member"}
                    </Link>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>Member</p>
                  </div>
                </div>
                
                {isOwner && a.user_id !== currentUserId && (
                  <button 
                    onClick={() => setRemovingMember({ id: a.id, name: a.profiles?.full_name || "Member", userId: a.user_id })}
                    style={{ 
                      background: "none", border: "none", color: "var(--color-danger)", 
                      cursor: "pointer", fontSize: "0.8rem", opacity: 0.6 
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "0.6"}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {mounted && removingMember && createPortal(
        <MemberPenaltyModal 
          isOpen={!!removingMember}
          memberName={removingMember.name}
          onClose={() => setRemovingMember(null)}
          onConfirm={(reason, detailedReason, penalty) => 
            handleRemoveMember(removingMember.id, removingMember.userId, removingMember.name, reason, detailedReason, penalty)
          }
        />,
        document.body
      )}
    </div>
  );
}

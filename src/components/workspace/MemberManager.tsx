"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastContext";

type Applicant = {
  id: string;
  user_id: string;
  status: string;
  profiles: { full_name: string, skills: string };
};

type ProjectOwner = {
  id: string;
  full_name: string;
};

export default function MemberManager({ projectId, isOwner }: { projectId: string, isOwner: boolean }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [ownerInfo, setOwnerInfo] = useState<ProjectOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();
  const { showToast } = useToast();

  useEffect(() => {
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
    
    if (project && project.profiles) {
      setOwnerInfo({
        id: project.owner_id,
        full_name: (project.profiles as unknown as { full_name: string }).full_name
      });
    }

    // 2. Fetch Applicants/Members
    const { data } = await supabase
      .from('project_members')
      .select('id, user_id, status, profiles(full_name, skills)')
      .eq('project_id', projectId);
    
    if (data) setApplicants(data as unknown as Applicant[]);
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
        content: `Đơn ứng tuyển của bạn đã được ${newStatus === 'approved' ? 'chấp nhận' : 'từ chối'}.`,
        project_id: projectId
      });

      showToast(`Đã ${newStatus === 'approved' ? 'chấp nhận' : 'từ chối'} thành viên!`, "info");
      fetchData();
    }
  };

  const handleRemoveMember = async (applicationId: string, fullName: string) => {
    const confirmed = confirm(`Bạn có chắc chắn muốn xóa ${fullName} khỏi dự án?`);
    if (!confirmed) return;

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', applicationId);

    if (!error) {
      showToast(`Đã xóa thành viên ${fullName} khỏi dự án.`, "success");
      fetchData();
    } else {
      showToast("Lỗi khi xóa thành viên.", "error");
    }
  };

  const pending = applicants.filter(a => a.status === 'pending');
  const members = applicants.filter(a => a.status === 'approved');

  if (loading) return <div>Loading team...</div>;

  return (
    <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
      <h3 style={{ marginBottom: "var(--spacing-lg)" }}>Team Management</h3>

      {isOwner && (
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <h4 style={{ fontSize: "0.9rem", color: "var(--color-warning)", textTransform: "uppercase" }}>Applications ({pending.length})</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            {pending.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>No pending applications.</p>
            ) : (
              pending.map(a => (
                <div key={a.id} className="glass-panel" style={{ padding: "var(--spacing-md)", background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <Link href={`/profile/${a.user_id}`} style={{ fontWeight: "600", fontSize: "1rem", color: "var(--color-brand-primary)" }}>
                      {a.profiles.full_name}
                    </Link>
                    <p style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{a.profiles.skills}</p>
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
        <h4 style={{ fontSize: "0.9rem", color: "var(--color-success)", textTransform: "uppercase" }}>Current Members ({members.length + (ownerInfo ? 1 : 0)})</h4>
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
                  {a.profiles.full_name.charAt(0)}
                </div>
                <div>
                  <Link href={`/profile/${a.user_id}`} style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--color-text-primary)" }}>
                    {a.profiles.full_name}
                  </Link>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>Member</p>
                </div>
              </div>
              
              {isOwner && a.user_id !== currentUserId && (
                <button 
                  onClick={() => handleRemoveMember(a.id, a.profiles.full_name)}
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
  );
}

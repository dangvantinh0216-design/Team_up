"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type Member = { 
  id: string;
  user_id: string; 
  status: string; 
  profiles: { 
    full_name: string; 
    id: string;
  } | null;
};

export default function MemberManager({ projectId }: { projectId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('project_members')
      .select('*, profiles(full_name, id)')
      .eq('project_id', projectId);
    if (data) setMembers(data);
    setLoading(false);
  };

  const updateStatus = async (memberId: string, newStatus: string, targetUserId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('project_members')
      .update({ status: newStatus })
      .eq('id', memberId);
    
    if (!error) {
      // Create notification for the member
      await supabase.from('notifications').insert({
        user_id: targetUserId,
        actor_id: user.id,
        type: 'approval',
        content: newStatus === 'approved' 
          ? `Congratulations! You have been approved to join the project.` 
          : `Your application to join the project has been rejected.`,
        project_id: projectId
      });
      fetchMembers();
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "var(--spacing-lg)" }}>Loading members...</div>;

  const pending = members.filter(m => m.status === 'pending');
  const approved = members.filter(m => m.status === 'approved');

  return (
    <div className="glass-panel" style={{ height: "100%", display: "flex", flexDirection: "column", padding: "var(--spacing-md)", overflowY: "auto" }}>
      
      <div style={{ marginBottom: "var(--spacing-lg)" }}>
        <h4 style={{ marginBottom: "var(--spacing-md)", fontSize: "0.9rem", color: "var(--color-warning)", textTransform: "uppercase", letterSpacing: "1px" }}>
          Pending Requests ({pending.length})
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          {pending.map(m => (
            <div key={m.id} className="glass-panel" style={{ padding: "var(--spacing-md)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <a 
                href={`/profile/${m.user_id}`} 
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  fontWeight: "600", 
                  marginBottom: "var(--spacing-sm)", 
                  display: "block", 
                  color: "var(--color-brand-primary)",
                  textDecoration: "underline"
                }}
              >
                {m.profiles?.full_name || 'Anonymous'} ↗
              </a>
              <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                <button 
                  onClick={() => updateStatus(m.id, 'approved', m.user_id)} 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: "6px", fontSize: "0.8rem" }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => updateStatus(m.id, 'rejected', m.user_id)} 
                  className="btn btn-outline" 
                  style={{ flex: 1, padding: "6px", fontSize: "0.8rem" }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {pending.length === 0 && (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>No pending requests.</p>
          )}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "var(--spacing-md) 0" }} />

      <div>
        <h4 style={{ marginBottom: "var(--spacing-md)", fontSize: "0.9rem", color: "var(--color-success)", textTransform: "uppercase", letterSpacing: "1px" }}>
          Current Team ({approved.length})
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
          {approved.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.03)" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{m.profiles?.full_name || 'Anonymous'}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--color-success)", fontWeight: "600", background: "rgba(16, 185, 129, 0.1)", padding: "2px 8px", borderRadius: "10px" }}>
                Active
              </span>
            </div>
          ))}
          {approved.length === 0 && (
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>No members yet.</p>
          )}
        </div>
      </div>
      
    </div>
  );
}

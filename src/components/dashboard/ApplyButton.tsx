"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastContext";

export default function ApplyButton({ projectId, userId, ownerId, initialStatus }: { projectId: string, userId: string, ownerId: string, initialStatus: string | null }) {
  const [status, setStatus] = useState<string | null>(initialStatus);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { showToast } = useToast();

  const handleApply = async () => {
    if (status) return;
    setLoading(true);

    const { error } = await supabase.from('project_members').insert({
      project_id: projectId,
      user_id: userId,
      status: 'pending'
    });

    if (!error) {
      await supabase.from('notifications').insert({
        user_id: ownerId,
        actor_id: userId,
        type: 'application',
        content: `Một thành viên mới vừa ứng tuyển vào dự án của bạn!`,
        project_id: projectId
      });

      showToast("Đã gửi đơn ứng tuyển thành công! 🚀", "success");
      setStatus('pending');
      router.refresh();
    } else {
      console.error("Apply Error:", error);
      showToast(`Lỗi: ${error.message}`, "error");
    }
    setLoading(false);
  };

  if (status === 'approved') {
    return (
      <a href={`/workspace/${projectId}`} className="btn btn-outline" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
        Go to Workspace
      </a>
    );
  }
  
  if (status === 'rejected') {
    return <span style={{ color: "var(--color-danger)", fontSize: "0.85rem", fontWeight: "600" }}>Application Rejected</span>;
  }
  
  if (status === 'pending') {
    return (
      <button className="btn btn-outline" disabled style={{ padding: "6px 16px", fontSize: "0.85rem", opacity: 0.6, cursor: "not-allowed" }}>
        Pending Approval
      </button>
    );
  }

  return (
    <button 
      onClick={handleApply} 
      className="btn btn-primary" 
      style={{ padding: "6px 16px", fontSize: "0.85rem" }}
      disabled={loading}
    >
      {loading ? "Applying..." : "Apply"}
    </button>
  );
}

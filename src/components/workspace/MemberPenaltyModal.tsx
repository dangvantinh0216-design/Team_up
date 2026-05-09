"use client";

import { useState } from "react";

type RemovalReason = "finished" | "inactive" | "behavior" | "other";

interface MemberPenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, detailedReason: string, penalty: number) => void;
  memberName: string;
}

export default function MemberPenaltyModal({ isOpen, onClose, onConfirm, memberName }: MemberPenaltyModalProps) {
  const [reason, setReason] = useState<RemovalReason>("finished");
  const [detailedReason, setDetailedReason] = useState("");

  if (!isOpen) return null;

  const getPenalty = (r: RemovalReason) => {
    if (r === "inactive") return 10;
    if (r === "behavior") return 25;
    return 0;
  };

  const handleConfirm = () => {
    let reasonText = "";
    switch(reason) {
      case "finished": reasonText = "Project Finished / Tasks Completed"; break;
      case "inactive": reasonText = "Inactivity / No contribution"; break;
      case "behavior": reasonText = "Bad behavior / Sabotage"; break;
      case "other": reasonText = "Other reason"; break;
    }
    onConfirm(reasonText, detailedReason, getPenalty(reason));
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
      padding: "20px"
    }}>
      <div className="glass-panel animate-fade-in custom-scrollbar" style={{ 
        width: "100%", maxWidth: "420px", 
        maxHeight: "85vh", overflowY: "auto",
        padding: "var(--spacing-lg)",
        border: "1px solid var(--color-border)", 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        display: "flex", flexDirection: "column"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "var(--spacing-sm)", color: "var(--color-brand-primary)", fontSize: "1.2rem" }}>
          Remove Member
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--spacing-md)", lineHeight: "1.4" }}>
          {memberName} will be removed from the team.
        </p>

        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <label style={{ display: "block", marginBottom: "var(--spacing-xs)", fontWeight: "600", fontSize: "0.8rem", opacity: 0.7 }}>PRIMARY REASON</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "8px 12px", borderRadius: "8px", border: reason === 'finished' ? "1px solid var(--color-brand-primary)" : "1px solid rgba(255,255,255,0.05)", background: reason === 'finished' ? "rgba(99, 102, 241, 0.1)" : "rgba(255,255,255,0.02)" }}>
              <input type="radio" checked={reason === 'finished'} onChange={() => setReason('finished')} />
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: "600" }}>Finished / Positive</div>
                <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>No penalty</div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "8px 12px", borderRadius: "8px", border: reason === 'inactive' ? "1px solid var(--color-warning)" : "1px solid rgba(255,255,255,0.05)", background: reason === 'inactive' ? "rgba(245, 158, 11, 0.1)" : "rgba(255,255,255,0.02)" }}>
              <input type="radio" checked={reason === 'inactive'} onChange={() => setReason('inactive')} />
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-warning)" }}>Lazy / Inactive</div>
                <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>-10 points</div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "8px 12px", borderRadius: "8px", border: reason === 'behavior' ? "1px solid var(--color-danger)" : "1px solid rgba(255,255,255,0.05)", background: reason === 'behavior' ? "rgba(239, 68, 68, 0.1)" : "rgba(255,255,255,0.02)" }}>
              <input type="radio" checked={reason === 'behavior'} onChange={() => setReason('behavior')} />
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-danger)" }}>Bad behavior / Sabotage</div>
                <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>-25 points</div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <label style={{ display: "block", marginBottom: "var(--spacing-xs)", fontWeight: "600", fontSize: "0.8rem", opacity: 0.7 }}>DETAILS (OPTIONAL)</label>
          <textarea 
            placeholder="Why are you removing this member?"
            style={{ 
              width: "100%", height: "80px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", 
              border: "1px solid var(--color-border)", color: "white", padding: "10px", fontSize: "0.85rem",
              resize: "none"
            }}
            value={detailedReason}
            onChange={(e) => setDetailedReason(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "var(--spacing-sm)", justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Cancel</button>
          <button 
            onClick={handleConfirm} 
            className={`btn ${reason === 'finished' ? 'btn-primary' : (reason === 'inactive' ? 'btn-warning' : 'btn-danger')}`}
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

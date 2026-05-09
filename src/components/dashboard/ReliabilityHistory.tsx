"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type HistoryItem = {
  id: string;
  points_changed: number;
  reason: string;
  detailed_reason: string;
  created_at: string;
  projects?: { title: string };
};

export default function ReliabilityHistory({ userId }: { userId: string }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchHistory() {
      const { data, error } = await supabase
        .from('reliability_history')
        .select('*, projects(title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setHistory(data as unknown as HistoryItem[]);
      }
      setLoading(false);
    }
    fetchHistory();
  }, [userId, supabase]);

  if (loading) return <div style={{ fontSize: "0.8rem", opacity: 0.5 }}>Loading history...</div>;
  if (history.length === 0) return <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", padding: "10px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "8px" }}>No reliability history yet. 🛡️</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {history.map(item => (
        <div key={item.id} style={{ 
          padding: "12px", 
          borderRadius: "8px", 
          background: "rgba(255,255,255,0.02)", 
          border: "1px solid rgba(255,255,255,0.05)",
          fontSize: "0.85rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ 
              fontWeight: "bold", 
              color: item.points_changed > 0 ? "var(--color-success)" : "var(--color-danger)" 
            }}>
              {item.points_changed > 0 ? `+${item.points_changed}` : item.points_changed} points
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
          <div style={{ fontWeight: "600", marginBottom: "2px" }}>{item.reason}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "4px" }}>Project: {item.projects?.title || "N/A"}</div>
          {item.detailed_reason && (
            <div style={{ 
              padding: "6px 8px", 
              background: "rgba(0,0,0,0.2)", 
              borderRadius: "4px", 
              fontSize: "0.8rem", 
              fontStyle: "italic",
              color: "var(--color-text-secondary)"
            }}>
              "{item.detailed_reason}"
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

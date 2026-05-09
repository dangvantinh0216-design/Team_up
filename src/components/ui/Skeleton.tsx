import React from "react";

export function Skeleton({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-panel" style={{ padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
      <Skeleton style={{ width: "60%", height: "24px" }} />
      <Skeleton style={{ width: "100%", height: "16px" }} />
      <Skeleton style={{ width: "80%", height: "16px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--spacing-md)" }}>
        <Skeleton style={{ width: "40%", height: "30px", borderRadius: "var(--radius-full)" }} />
        <Skeleton style={{ width: "20%", height: "30px", borderRadius: "var(--radius-full)" }} />
      </div>
    </div>
  );
}

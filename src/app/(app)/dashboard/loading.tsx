import { SkeletonCard, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)" }}>
      
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <Skeleton style={{ width: "300px", height: "40px", marginBottom: "8px" }} />
        <Skeleton style={{ width: "200px", height: "20px" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--spacing-2xl)", alignItems: "start" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
            <Skeleton style={{ width: "100px", height: "24px", marginBottom: "var(--spacing-md)" }} />
            <Skeleton style={{ width: "100%", height: "100px", marginBottom: "var(--spacing-lg)" }} />
            <Skeleton style={{ width: "100%", height: "40px", borderRadius: "var(--radius-full)" }} />
          </div>

          <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
            <Skeleton style={{ width: "120px", height: "24px", marginBottom: "var(--spacing-md)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} style={{ width: "100%", height: "50px", borderRadius: "var(--radius-md)" }} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", gap: "var(--spacing-md)", marginBottom: "var(--spacing-xl)" }}>
            <Skeleton style={{ width: "150px", height: "40px" }} />
            <Skeleton style={{ width: "150px", height: "40px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: "var(--spacing-xl)" }}>
      <div className="glass-panel" style={{ 
        padding: "var(--spacing-2xl)", 
        display: "flex", 
        gap: "var(--spacing-2xl)", 
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>
        <div style={{ textAlign: "center", width: "280px", flexShrink: 0 }}>
          <Skeleton style={{ width: "140px", height: "140px", borderRadius: "50%", margin: "0 auto var(--spacing-lg)" }} />
          <Skeleton style={{ width: "200px", height: "30px", margin: "0 auto 8px" }} />
          <Skeleton style={{ width: "150px", height: "24px", margin: "0 auto var(--spacing-xl)", borderRadius: "20px" }} />
          <Skeleton style={{ width: "100%", height: "45px", borderRadius: "12px" }} />
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <Skeleton style={{ width: "150px", height: "20px", marginBottom: "var(--spacing-md)" }} />
            <Skeleton style={{ width: "100%", height: "80px" }} />
          </div>
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <Skeleton style={{ width: "100px", height: "20px", marginBottom: "var(--spacing-md)" }} />
            <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
              {[1, 2, 3, 4].map(i => <Skeleton key={i} style={{ width: "80px", height: "32px", borderRadius: "8px" }} />)}
            </div>
          </div>
          <div>
            <Skeleton style={{ width: "180px", height: "20px", marginBottom: "var(--spacing-md)" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
              {[1, 2].map(i => <Skeleton key={i} style={{ width: "100%", height: "120px", borderRadius: "12px" }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

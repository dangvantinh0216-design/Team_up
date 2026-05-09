import Navbar from "@/components/layout/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="container" style={{ flex: 1, paddingBottom: "var(--spacing-2xl)" }}>
        {children}
      </main>
    </div>
  );
}

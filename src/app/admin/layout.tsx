import SidebarAdmin from "@/components/SidebarAdmin"; // Import komponen baru yang disiapkan

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      <SidebarAdmin />
      
      <main style={{ flex: 1, backgroundColor: "#f0f4f9", padding: "24px" }}>
        {children}
      </main>
    </div>
  );
}
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Statistik", path: "/admin/statistik" },
    { name: "Produk", path: "/admin/produk" },
    { name: "Pesanan", path: "/admin/pesanan" },
    { name: "Akun", path: "/admin/akun" },
    { name: "Stok", path: "/admin/stok" },
    { name: "Customize", path: "/admin/hero" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <>
      <style jsx>{`
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background-color: #ffffff;
          padding: 32px 20px;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          flex-shrink: 0;
        }

        .header-title {
          font-size: 18px;
          font-weight: bold;
          color: #0f172a;
          margin: 0 0 16px 0;
          text-align: center;
        }

        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin-bottom: 24px;
          width: 100%;
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .sidebar :global(a.nav-item) {
          position: relative;
          display: block;
          padding: 12px 18px;
          background-color: #ffffff;
          color: #0f172a;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .sidebar :global(a.nav-item.active) {
          background-color: #eff6ff;
          color: #1d4ed8;
          font-weight: 600;
        }

        /* Garis biru vertikal di sebelah kiri item yang aktif */
        .sidebar :global(a.nav-item.active)::before {
          content: "";
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 4px;
          background-color: #2563eb;
          border-radius: 4px;
        }

        .btn-logout {
          margin-top: auto;
          padding: 12px 18px;
          border-radius: 8px;
          border: none;
          background-color: #ffffff;
          color: #0f172a;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          text-align: left;
          transition: background-color 0.2s;
        }

        .btn-logout:hover {
          background-color: #f8fafc;
        }
      `}</style>

      <aside className="sidebar">
        <h2 className="header-title">Dashboard Admin</h2>
        <div className="divider"></div>

        <nav className="nav-list">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
    </>
  );
}
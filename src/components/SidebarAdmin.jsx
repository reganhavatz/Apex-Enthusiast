"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin Utama");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.name) {
          setAdminName(userData.name);
        } else if (userData.username) {
          setAdminName(userData.username);
        }
      } catch (e) {
        setAdminName(storedUser);
      }
    }
  }, []);

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
          width: 280px;
          min-height: 100vh;
          background-color: #ffffff;
          padding: 32px 0 32px 0;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          flex-shrink: 0;
          position: fixed;
        }

        .profile-container {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px 24px 20px;
        }

        .profile-avatar-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          flex-shrink: 0;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .profile-name {
          font-size: 16px;
          font-weight: bold;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-role {
          font-size: 13px;
          color: #64748b;
          margin: 2px 0 0 0;
          text-transform: capitalize;
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
          padding: 0 20px;
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
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
        }

        .sidebar :global(a.nav-item:hover) {
          background-color: #f8fafc;
        }

        .sidebar :global(a.nav-item.active) {
          background-color: #eff6ff;
          color: #1d4ed8;
          font-weight: 600;
        }

        .sidebar :global(a.nav-item.active)::before {
          content: "";
          position: absolute;
          left: -20px;
          top: 6px;
          bottom: 6px;
          width: 4px;
          background-color: #2563eb;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        .logout-container {
          padding: 0 20px;
          margin-top: auto;
        }

        .btn-logout {
          width: 100%;
          padding: 12px 18px;
          border-radius: 8px;
          border: none;
          background-color: #ffffff;
          color: #ef4444;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          text-align: left;
          transition: background-color 0.2s;
        }

        .btn-logout:hover {
          background-color: #fef2f2;
        }
      `}</style>

      <aside className="sidebar">
        <div className="profile-container">
          <div className="profile-avatar-placeholder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{adminName}</h3>
            <p className="profile-role">admin</p>
          </div>
        </div>

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
        <div className="logout-container">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
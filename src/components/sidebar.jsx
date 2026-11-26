"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState({ username: "Hava", role: "User", avatar: "" });

    useEffect(() => {
        const loadUser = () => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser({
                    username: parsedUser.username || "Hava",
                    role: parsedUser.level || "User",
                    avatar: parsedUser.avatar || "",
                });
            }
        };

        loadUser();
        window.addEventListener("storage_updated", loadUser);
        return () => window.removeEventListener("storage_updated", loadUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("storage_updated"));
        router.push("/auth/login");
    };

    return (
        <>
            <style jsx>{`
                .sidebar {
                    width: 220px;
                    height: 100vh;
                    background-color: #ffffff;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 24px 16px;
                    flex-shrink: 0;
                    box-sizing: border-box;
                    border-right: 1px solid #e2e8f0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    position:fixed;
                }

                .user-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #f1f5f9;
                    margin-bottom: 24px;
                }

                .avatar-wrapper {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .avatar-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-fallback {
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                }

                .username {
                    font-size: 14px;
                    font-weight: 700;
                    color: #0f172a;
                    line-height: 1.2;
                }

                .user-role {
                    font-size: 11px;
                    color: #64748b;
                    margin-top: 2px;
                }

                .nav-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .sidebar :global(a.nav-item),
                .logout-btn {
                    position: relative;
                    display: block;
                    width: 100%;
                    padding: 10px 16px;
                    background-color: #ffffff;
                    color: #1e293b;
                    font-size: 13px;
                    font-weight: 500;
                    text-decoration: none;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid #f1f5f9;
                    text-align: center;
                    box-sizing: border-box;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    text-align:left;
                }

                .sidebar :global(a.nav-item.active) {
                    background-color: #eff6ff;
                    color: #0f172a;
                    font-weight: 600;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                }

                .sidebar :global(a.nav-item.active)::before {
                    content: "";
                    position: absolute;
                    left: -12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 4px;
                    height: 24px;
                    background-color: #1d4ed8;
                    border-radius: 4px;
                }

                
            `}</style>

            <aside className="sidebar">
                <div>
                    <div className="user-header">
                        <div className="avatar-wrapper">
                            {user.avatar ? (
                                <img src={user.avatar} alt="User" className="avatar-img" />
                            ) : (
                                <span className="avatar-fallback">
                                    {user.username ? user.username.charAt(0).toUpperCase() : "H"}
                                </span>
                            )}
                        </div>
                        <div className="user-info">
                            <span className="username">{user.username}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                    </div>

                    <nav className="nav-menu">
                        <Link
                            href="/profil"
                            className={`nav-item ${pathname === "/profil" ? "active" : ""}`}
                        >
                            Profil
                        </Link>

                        <Link
                            href="/profil/riwayat"
                            className={`nav-item ${pathname === "/profil/riwayat" ? "active" : ""}`}
                        >
                            Riwayat Pesanan
                        </Link>
 
                    </nav>
                </div>

                <div>
                    <Link href="/" className="nav-item">
                        Kembali ke beranda
                    </Link>
                </div>
            </aside>
        </>
    );
}
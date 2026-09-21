"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkLoginStatus = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setIsLoggedIn(true);
        const parsed = JSON.parse(userData);
        setAvatar(parsed.avatar || "");
      } else {
        setIsLoggedIn(false);
        setAvatar("");
      }
    };
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    checkLoginStatus();

    window.addEventListener("storage_updated", checkLoginStatus);
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage_updated", checkLoginStatus);
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

 const handleLogout = () => {
    // Hapus "user_profile" atau sesuaikan saat logout
    localStorage.removeItem("user_profile");
    window.dispatchEvent(new Event("storage_updated"));
    setIsOpen(false);
    router.push("/auth/login");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="header-wrapper">
      <header className={`header-container ${isScrolled ? "scrolled" : ""}`}>
        <Link href="/">
          <img
            src="http://localhost/api/uploads/logo.png"
            alt="Logo Toko"
            className="logo-img"
          />
        </Link>

        <nav className="nav-links">
          <Link href="/">HOME</Link>
          <Link href="/listproduk?kategori=Sepak Bola">SEPAK BOLA</Link>
          <Link href="/listproduk?kategori=Futsal">FUTSAL</Link>
          <Link href="/listproduk?kategori=Sepatu Lari">SEPATU LARI</Link>
        </nav>

        <div>
          {isLoggedIn ? (
            <div className="profile-area">
              <div className="avatar-box" onClick={() => setIsOpen(!isOpen)}>
                {avatar ? (
                  <img src={avatar} alt="Profile" />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#d1d5db' }}></div>
                )}
              </div>

              {isOpen && (
                <div className="dropdown">
                  <Link
                    href="/profil"
                    className="dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard saya
                  </Link>

                  <button
                    type="button"
                    className="dropdown-item red"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="login-btn" title="Login">
              Login
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
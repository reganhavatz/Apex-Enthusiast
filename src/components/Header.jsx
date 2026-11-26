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
  const [searchQuery, setSearchQuery] = useState("");

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
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage_updated"));
    setIsOpen(false);
    router.push("/auth/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listproduk?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/listproduk`);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ width: "100%", position: "sticky", top: 0, zIndex: 1000, backgroundColor: "#ffffff" }}>
      <header
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isScrolled ? "0 4px 12px rgba(0, 0, 0, 0.05)" : "none",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {/* LOGO */}
        <Link
          href="/"
          style={{
            fontSize: "20px",
            fontWeight: 900,
            fontStyle: "italic",
            color: "#0f172a",
            textDecoration: "none",
            letterSpacing: "-0.5px",
            whiteSpace: "nowrap"
          }}
        >
          APEX ENTHUSIAST
        </Link>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            maxWidth: "520px",
            margin: "0 40px",
            position: "relative"
          }}
        >
          <svg
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
              width: "16px",
              height: "16px"
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari yang ingin anda temukan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              outline: "none",
              color: "#0f172a",
              boxSizing: "border-box"
            }}
          />
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "24px", marginRight: "24px" }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                color: "#0f172a",
                whiteSpace: "nowrap"
              }}
            >
              Beranda
            </Link>
            <Link
              href="/listproduk?kategori=sneakers"
              style={{
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                color: "#0f172a",
                whiteSpace: "nowrap"
              }}
            >
              Sneakers
            </Link>
            <Link
              href="/listproduk?kategori=apparel"
              style={{
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 700,
                color: "#0f172a",
                whiteSpace: "nowrap"
              }}
            >
              Apparel
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <Link
              href="/keranjang"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid #000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                marginRight: "-1px",
                position: "relative",
                zIndex: 1
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2">
                  <path d="M5 7h13.79a2 2 0 0 1 1.99 2.199l-.6 6A2 2 0 0 1 18.19 17H8.64a2 2 0 0 1-1.962-1.608z" />
                  <path strokeLinecap="round" d="m5 7l-.81-3.243A1 1 0 0 0 3.22 3H2m6 18h2m6 0h2" />
                </g>
              </svg>
            </Link>

            <div>
              {isLoggedIn ? (
                <div style={{ position: "relative" }}>
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid #000000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ffffff"
                    }}
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "50%",
                          height: "50%",
                          background: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000",
                          fontWeight: "bold",
                          fontSize: "18px"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C7.56 3.99 9.54 2 12 2a4.435 4.435 0 0 1 .16 8.87m-5 3.69c-2.42 1.62-2.42 4.26 0 5.87c2.75 1.84 7.26 1.84 10.01 0c2.42-1.62 2.42-4.26 0-5.87c-2.74-1.83-7.25-1.83-10.01 0" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "48px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        width: "160px",
                        overflow: "hidden",
                        zIndex: 100,
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <Link
                        href="/profil"
                        onClick={() => setIsOpen(false)}
                        style={{
                          padding: "10px 16px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#000000",
                          textDecoration: "none",
                          display: "block"
                        }}
                      >
                        Dashboard saya
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          padding: "10px 16px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          width: "100%"
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Link
                    href="/auth/login"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#0f172a",
                      border: "1px solid #cbd5e1",
                      padding: "8px 20px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "13px",
                      textDecoration: "none",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      boxSizing: "border-box"
                    }}
                  >
                    Masuk
                  </Link>

                  <Link
                    href="/auth/register"
                    style={{
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                      border: "1px solid #0f172a",
                      padding: "8px 20px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "13px",
                      textDecoration: "none",
                      display: "inline-block",
                      whiteSpace: "nowrap",
                      boxSizing: "border-box"
                    }}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
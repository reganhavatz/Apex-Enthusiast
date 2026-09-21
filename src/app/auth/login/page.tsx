"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();

      if (result.status === "success") {
        // AMBIL DATA LAMA (agar avatar, telepon, dll tidak hilang)
        const existingData = localStorage.getItem("user");
        let parsedExisting = existingData ? JSON.parse(existingData) : {};

        // GABUNGKAN data lama dengan data login baru
        const updatedUser = {
          ...parsedExisting,
          username: form.username,
          level: result.level,
        };

        // SIMPAN KEMBALI
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("storage_updated"));

        if (result.level === "admin") {
          router.push("/admin/produk");
        } else {
          router.push("/");
        }
      } else {
        alert("Login gagal: " + result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  return (
    <>
      <style jsx>{`
        .container-login {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8fafc;
          padding: 16px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .box-form {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          padding: 36px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .btn-back {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .btn-back:hover {
          color: #0f172a;
        }
        .title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.4px;
          margin-top:20px;
        }
        .subtitle {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 28px;
        }
        .input-group {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }
        .input-group input {
          width: 100%;
          padding: 10px 14px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
          font-size: 14px;
          color: #0f172a;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .input-group input:focus {
          border-color: #0f172a;
          background-color: #ffffff;
        }
        .btn-submit {
          width: 100%;
          background: #0f172a;
          color: #ffffff;
          padding: 11px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .btn-submit:hover {
          background: #1e293b;
        }
        .regis {
          text-align:center;
          font-weight:medium;
          margin-top:30px;
          font-weight:600;
          font-size:14px;
          color:#64748b;
        }
      `}</style>

      <div className="container-login">
        <div className="box-form">
          <Link href="/" className="btn-back">
            ← Kembali ke Beranda
          </Link>

          <h2 className="title">Login</h2>
          <p className="subtitle">Masuk ke akun kamu untuk melanjutkan</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Masukkan username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Masuk
            </button>
          </form>

          <h5 className="regis">Belum punya akun? <Link href={"/auth/register"}>Daftar</Link></h5>
        </div>
      </div>
    </>
  );
}
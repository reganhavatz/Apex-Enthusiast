"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserItem {
  id: number | string;
  nama: string;
  email: string;
}

export default function KelolaAkunPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        const response = await fetch("http://localhost/api/get_users.php");

        if (!response.ok) {
          throw new Error("Gagal mengambil data dari database server lokal.");
        }

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setErrorMsg("Gagal terhubung ke database. Pastikan XAMPP/Apache aktif.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleHapus = async (id: number | string) => {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus akun pengguna ini dari database?");
    if (!konfirmasi) return;

    try {
      const response = await fetch(`http://localhost/api/get_users.php?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || result.status === "error") {
        throw new Error(result.message || "Gagal menghapus pengguna.");
      }

      setUsers(users.filter((user) => user.id !== id));
    } catch (err: any) {
      console.error("Error deleting user:", err);
      alert(err.message || "Terjadi kesalahan saat menghapus pengguna.");
    }
  };

  return (
    <>
      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin-top:-50px;
          margin-left:270px;
          width:1005px;
        }

        .main-content {
          flex: 1;
          padding: 36px 48px;
        }

        .judul-halaman {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .card-header {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 24px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
          border: 1px solid #e2e8f0;
        }

        .header-title {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .header-subtitle {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }

        .alert-error {
          margin-bottom: 24px;
          padding: 16px 20px;
          background-color: #fef2f2;
          color: #991b1b;
          border-radius: 12px;
          font-size: 13px;
          border: 1px solid #fecaca;
        }

        .card-tabel {
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .tabel {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .tabel-head {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .tabel-head th {
          padding: 16px 24px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.05em;
        }

        .tabel-row {
          transition: background-color 0.15s ease;
        }

        .tabel-row:not(:last-child) td {
          border-bottom: 1px solid #f1f5f9;
        }

        .tabel-row:hover {
          background-color: #f8fafc;
        }

        .tabel-row td {
          padding: 18px 24px;
          font-size: 13px;
          color: #334155;
          vertical-align: middle;
        }

        .col-nama {
          font-weight: 600;
          color: #0f172a;
        }

        .col-email {
          color: #64748b;
        }

        .btn-hapus {
          display: inline-block;
          background-color: #ef4444;
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-hapus:hover {
          background-color: #dc2626;
        }

        .state-info {
          text-align: center;
          padding: 56px;
          color: #64748b;
          font-size: 13px;
        }
      `}</style>

      <div className="layout">
        <main className="main-content">
          <h1 className="judul-halaman">Kelola Pengguna</h1>

          <div className="card-header">
            <div>
              <h2 className="header-title">Daftar Pengguna</h2>
              <p className="header-subtitle">
                Total {users.length} Pengguna terdaftar dalam database
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="alert-error">
              {errorMsg}
            </div>
          )}

          <div className="card-tabel">
            <table className="tabel">
              <thead>
                <tr className="tabel-head">
                  <th style={{ width: "35%" }}>NAMA</th>
                  <th style={{ width: "45%" }}>EMAIL</th>
                  <th style={{ width: "20%" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="state-info">
                      Memuat data pengguna dari database...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((item) => (
                    <tr key={item.id} className="tabel-row">
                      <td className="col-nama">{item.nama}</td>
                      <td className="col-email">{item.email}</td>
                      <td>
                        <button
                          onClick={() => handleHapus(item.id)}
                          className="btn-hapus"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="state-info">
                      Belum ada pengguna yang tersimpan di database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
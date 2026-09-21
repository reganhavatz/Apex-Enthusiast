"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProdukItem {
  id: number | string;
  nama: string;
  stok: number | string;
  ukuran?: string;
}

export default function KelolaStokPage() {
  const router = useRouter();
  const [produk, setProduk] = useState<ProdukItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStokProduk() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/produk");

        if (!response.ok) {
          throw new Error("Gagal mengambil data stok dari database.");
        }

        const data = await response.json();
        setProduk(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error fetching stock:", err);
        setErrorMsg("Gagal memuat data dari database. Menampilkan data lokal sementara.");

        const localData = localStorage.getItem("admin_products");
        if (localData) {
          setProduk(JSON.parse(localData));
        } else {
          setProduk([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchStokProduk();
  }, []);

  const getStatusStok = (stok: number | string) => {
    const jumlah = Number(stok);
    if (isNaN(jumlah) || jumlah <= 0) {
      return { text: "Habis", bg: "#fee2e2", color: "#991b1b" }; // Merah soft
    } else if (jumlah < 5) {
      return { text: "Kritis", bg: "#fef3c7", color: "#92400e" }; // Kuning/Oranye soft
    } else {
      return { text: "Aman", bg: "#d1fae5", color: "#065f46" }; // Hijau soft
    }
  };

  return (
    <>
      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin-top:-40px;
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

        /* Desain Badge Status */
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Desain Tombol Edit Murni (Clean Button) */
        .btn-edit {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        .btn-edit:hover {
          background-color: #1d4ed8;
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
          <h1 className="judul-halaman">Kelola Stok Produk</h1>

          <div className="card-header">
            <div>
              <h2 className="header-title">Daftar Stok Produk</h2>
              <p className="header-subtitle">
                Total {produk.length} produk terdaftar untuk pemantauan stok aktif
              </p>
            </div>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: "16px", padding: "14px 18px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "10px", fontSize: "13px", border: "1px solid #fecaca" }}>
              {errorMsg}
            </div>
          )}

          <div className="card-tabel">
            <table className="tabel">
              <thead>
                <tr className="tabel-head">
                  <th style={{ width: "35%" }}>PRODUK</th>
                  <th style={{ width: "15%" }}>UKURAN</th>
                  <th style={{ width: "15%" }}>SISA STOK</th>
                  <th style={{ width: "15%" }}>STATUS</th>
                  <th style={{ width: "20%" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="state-info">
                      Memuat data stok dari database...
                    </td>
                  </tr>
                ) : produk.length > 0 ? (
                  produk.map((item) => {
                    const statusStok = getStatusStok(item.stok);
                    return (
                      <tr key={item.id} className="tabel-row">
                        <td className="col-nama">{item.nama}</td>
                        <td style={{ color: "#64748b" }}>{item.ukuran || "All / -"}</td>
                        <td style={{ fontWeight: 600 }}>{item.stok}</td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: statusStok.bg,
                              color: statusStok.color,
                            }}
                          >
                            {statusStok.text}
                          </span>
                        </td>
                        <td>
                          <Link href={`/admin/produk/edit/${item.id}`} className="btn-edit">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="state-info">
                      Belum ada produk yang tersimpan di dalam database.
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
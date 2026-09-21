"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProdukItem {
  id: number | string;
  nama: string;
  kategori: string;
  harga: string;
  stok: number | string;
  image?: string | null;
}

export default function ListProduk() {
  const router = useRouter();
  const [produk, setProduk] = useState<ProdukItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProdukDariDatabase() {
      try {
        setIsLoading(true);
        // Sesuaikan jika endpoint get produk Anda ada di file PHP lain, misal: http://localhost/api/get_produk.php
        const response = await fetch("http://localhost/api/get_produk.php");

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk dari database.");
        }

        const data = await response.json();
        setProduk(data);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setErrorMsg("Gagal memuat data dari database. Menampilkan data lokal sementara.");

        const localData = localStorage.getItem("admin_products");
        if (localData) {
          setProduk(JSON.parse(localData));
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProdukDariDatabase();
  }, []);

  // Fungsi Hapus Produk yang sudah diarahkan ke file PHP XAMPP
  const handleDelete = async (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari database?")) {
      try {
        // Mengarahkan fetch langsung ke server XAMPP (hapus_produk.php)
        const response = await fetch(`http://localhost/api/hapus_produk.php?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Gagal menghapus produk di database.");
        }

        // Update state lokal agar baris tabel langsung hilang tanpa perlu refresh halaman
        const updatedProduk = produk.filter((item) => item.id !== id);
        setProduk(updatedProduk);
        localStorage.setItem("admin_products", JSON.stringify(updatedProduk));
        
        alert("Produk berhasil dihapus!");
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat menghapus produk.");
      }
    }
  };

  return (
    <>
      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          margin-top: -40px;
        }

        .main-content {
          flex: 1;
          padding: 24px 32px;
        }

        .judul-halaman {
          font-size: 20px;
          font-weight: bold;
          color: #000000;
          margin-bottom: 18px;
        }

        .card-header {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          height: 100px;
        }

        .header-title {
          font-size: 20px;
          font-weight: bold;
          color: #000000;
        }

        .header-subtitle {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .btn-tambah {
          background-color: #1d4ed8;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
          height: 35px;
        }

        .btn-tambah:hover {
          background-color: #1e40af;
        }

        .card-tabel {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .tabel {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .tabel-head {
          background-color: #f3f4f6;
        }

        .tabel-head th {
          padding: 10px 14px;
          font-size: 11px;
          font-weight: bold;
          color: #000000;
          text-transform: uppercase;
        }

        .th-aksi {
          text-align: center;
        }

        .tabel-row {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .tabel-row:hover {
          background-color: #f8fafc;
        }

        .tabel-row td {
          padding: 12px 14px;
          font-size: 12px;
          color: #374151;
          vertical-align: middle;
        }

        .img-container {
          width: 60px;
          height: 60px;
          background-color: #e5e7eb;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image-text {
          font-size: 10px;
          color: #6b7280;
          text-align: center;
          line-height: 1.1;
        }

        .col-nama {
          font-weight: bold;
          color: #111827;
        }

        .col-kategori {
          color: #374151;
          font-weight: 500;
        }

        .col-harga {
          color: #111827;
          font-weight: 500;
        }

        .col-stok {
          color: #111827;
          font-weight: 500;
        }

        .aksi-wrapper {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .btn-edit,
        .btn-hapus {
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 5px;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }

        .btn-edit { background-color: #2563eb; }
        .btn-edit:hover { background-color: #1d4ed8; }

        .btn-hapus { background-color: #dc2626; }
        .btn-hapus:hover { background-color: #b91c1c; }

        .state-info {
          text-align: center;
          padding: 24px;
          color: #6b7280;
          font-style: italic;
        }
      `}</style>

      <div className="layout">
        <main className="main-content">
          <h1 className="judul-halaman">List Produk</h1>

          <div className="card-header">
            <div>
              <h2 className="header-title">Kelola produk</h2>
              <p className="header-subtitle">
                Total {produk.length} produk terdaftar di database
              </p>
            </div>
            <Link href={"/admin/produk/tambah"}>
              <button className="btn-tambah">+ Tambah Produk Baru</button>
            </Link>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: "12px", padding: "10px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "6px", fontSize: "12px" }}>
              {errorMsg}
            </div>
          )}

          <div className="card-tabel">
            <table className="tabel">
              <thead>
                <tr className="tabel-head">
                  <th style={{ width: "8%" }}>FOTO</th>
                  <th style={{ width: "34%" }}>NAMA PRODUK</th>
                  <th style={{ width: "18%" }}>KATEGORI</th>
                  <th style={{ width: "16%" }}>HARGA</th>
                  <th style={{ width: "10%" }}>STOK</th>
                  <th style={{ width: "14%" }} className="th-aksi">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="state-info">
                      Memuat data produk dari database...
                    </td>
                  </tr>
                ) : produk.length > 0 ? (
                  produk.map((item) => (
                    <tr
                      key={item.id}
                      className="tabel-row"
                      onClick={() => router.push(`/checkout/${item.id}`)}
                    >
                      <td>
                        <div className="img-container">
                          {item.image ? (
                            <img
                              src={
                                item.image.startsWith("http") || item.image.startsWith("data:")
                                  ? item.image
                                  : `http://localhost/api/uploads/${item.image}`
                              }
                              alt={item.nama}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="no-image-text">No Image</span>
                          )}
                        </div>
                      </td>
                      <td className="col-nama">{item.nama}</td>
                      <td className="col-kategori">{item.kategori}</td>
                      <td className="col-harga">{item.harga}</td>
                      <td className="col-stok">{item.stok}</td>
                      <td>
                        <div className="aksi-wrapper">
                          <Link
                            href={`/admin/produk/edit/${item.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="btn-edit">Edit</button>
                          </Link>
                          <button
                            className="btn-hapus"
                            onClick={(e) => handleDelete(e, item.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="state-info">
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
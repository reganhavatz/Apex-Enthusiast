"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProdukItem {
  id: number | string;
  nama: string;
  kategori: string;
  harga: string | number;
  stok: number | string;
  image?: string | null;
  sku?: string;
  deskripsi?: string;
}

export default function ListProduk() {
  const router = useRouter();
  const [produk, setProduk] = useState<ProdukItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("Semua Kategori");
  const [selectedStatusStok, setSelectedStatusStok] = useState<string>("Status Stok");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  useEffect(() => {
    async function fetchProdukDariDatabase() {
      try {
        setIsLoading(true);
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

  const handleDelete = async (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari database?")) {
      try {
        const response = await fetch(`http://localhost/api/hapus_produk.php?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Gagal menghapus produk di database.");
        }

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

  const formatRupiah = (angka: string | number) => {
    const nomor = Number(angka);
    if (isNaN(nomor)) return angka;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(nomor);
  };

  const daftarKategori = ["Semua Kategori", ...Array.from(new Set(produk.map((item) => item.kategori).filter(Boolean)))];

  const filteredProduk = produk.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKategori = selectedKategori === "Semua Kategori" || item.kategori === selectedKategori;

    let matchStok = true;
    const stokNum = Number(item.stok) || 0;
    if (selectedStatusStok === "Stok Menipis") {
      matchStok = stokNum > 0 && stokNum <= 3;
    } else if (selectedStatusStok === "Stok Habis") {
      matchStok = stokNum === 0;
    } else if (selectedStatusStok === "Stok Aman") {
      matchStok = stokNum > 3;
    }

    return matchSearch && matchKategori && matchStok;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedKategori, selectedStatusStok]);

  const totalPages = Math.ceil(filteredProduk.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProduk = filteredProduk.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          margin: -30px -30px -20px -20px;
        }

        .main-content {
          flex: 1;
          padding: 24px 36px;
          max-width: 1100px;
          margin: 0 0 0 270px;
        }

        .page-header-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          background-color: white;
          height: 100px;
          border-radius: 10px;
        }

        .judul-halaman {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin: 20px 0 4px 15px;
        }

        .sub-judul {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 0 15px;
        }

        .btn-tambah {
          background-color: #2563eb;
          color: #ffffff !important;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none !important;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
          white-space: nowrap;
          margin-top: 30px;
          margin-right: 20px;
        }

        .btn-tambah:hover {
          background-color: #1d4ed8;
        }

        .card-toolbar {
          background-color: #ffffff;
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          gap: 12px;
          flex-wrap: wrap;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 300px;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 13px;
          outline: none;
          background-color: #ffffff;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          font-size: 13px;
          pointer-events: none;
        }

        .select-filter {
          padding: 10px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          outline: none;
          background-color: #ffffff;
          color: #334155;
          cursor: pointer;
        }

        .select-filter:focus {
          border-color: #2563eb;
        }

        .card-tabel {
          background-color: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
          padding: 14px 18px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .tabel-row {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .tabel-row:not(:last-child) td {
          border-bottom: 1px solid #f1f5f9;
        }

        .tabel-row:hover {
          background-color: #f8fafc;
        }

        .tabel-row td {
          padding: 16px 18px;
          font-size: 13px;
          color: #334155;
          vertical-align: middle;
        }

        .img-container {
          width: 48px;
          height: 48px;
          background-color: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image-text {
          font-size: 9px;
          color: #94a3b8;
          text-align: center;
          font-weight: 500;
        }

        .col-nama-main {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .col-nama-sub {
          font-size: 12px;
          color: #64748b;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }

        .kategori-badge {
          display: inline-block;
          padding: 5px 14px;
          background-color: #eff6ff;
          color: #1d4ed8;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid #dbeafe;
        }

        .stok-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          min-width: 45px;
        }

        .stok-badge.aman {
          background-color: #f0fdf4;
          color: #15803d;
          border: 1px solid #dcfce7;
        }

        .stok-badge.aman::before {
          content: "";
          width: 6px;
          height: 6px;
          background-color: #22c55e;
          border-radius: 50%;
        }

        .stok-badge.kritis {
          background-color: #fefce8;
          color: #ca8a04;
          border: 1px solid #fef08a;
        }

        .stok-badge.kritis::before {
          content: "";
          width: 6px;
          height: 6px;
          background-color: #eab308;
          border-radius: 50%;
        }

        .stok-badge.habis {
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fee2e2;
        }

        .stok-badge.habis::before {
          content: "";
          width: 6px;
          height: 6px;
          background-color: #ef4444;
          border-radius: 50%;
        }

        .aksi-wrapper {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
        }

        .btn-aksi {
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          border: none;
          transition: all 0.15s;
        }

        .btn-edit {
          background-color: #eff6ff;
          color: #2563eb;
        }
        .btn-edit:hover {
          background-color: #dbeafe;
        }

        .btn-hapus {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .btn-hapus:hover {
          background-color: #fee2e2;
        }

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding: 0 4px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-info {
          font-size: 13px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-select {
          padding: 4px 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 12px;
          background-color: #ffffff;
        }

        .pagination-container {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pagination-btn {
          height: 32px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #f1f5f9;
        }

        .pagination-btn.active {
          background-color: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .state-info {
          text-align: center;
          padding: 48px;
          color: #64748b;
          font-weight: 500;
        }
      `}</style>

      <div className="layout">
        <main className="main-content">
          <div className="page-header-container">
            <div>
              <h1 className="judul-halaman">Kelola Produk</h1>
              <p className="sub-judul">Total {produk.length} produk terdaftar di database inventaris</p>
            </div>
            <Link href={"/admin/produk/tambah"}>
              <button className="btn-tambah">
                <span>+</span> Tambah Produk
              </button>
            </Link>
          </div>

          <div className="card-toolbar">
            <div className="toolbar-left">
              <div className="search-wrapper">
                <span className="search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <g fill="none">
                      <path fill="currentColor" d="M17.8 10.26a7.61 7.61 0 1 1-15.23 0a7.61 7.61 0 0 1 15.22 0" opacity=".2" />
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m15.68 15.63l5.7 5.7M17.8 10.26a7.6 7.6 0 0 1-7.62 7.6a7.61 7.61 0 1 1 7.61-7.6" />
                    </g>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari nama produk...."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="toolbar-right">
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="select-filter"
              >
                {daftarKategori.map((kat, idx) => (
                  <option key={idx} value={kat}>{kat}</option>
                ))}
              </select>

              <select
                value={selectedStatusStok}
                onChange={(e) => setSelectedStatusStok(e.target.value)}
                className="select-filter"
              >
                <option value="Status Stok">Status Stok</option>
                <option value="Stok Aman">Stok Aman</option>
                <option value="Stok Menipis">Stok Menipis</option>
                <option value="Stok Habis">Stok Habis</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: "16px", padding: "14px 18px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "10px", fontSize: "13px", border: "1px solid #fecaca", fontWeight: 500 }}>
              {errorMsg}
            </div>
          )}

          <div className="card-tabel">
            <table className="tabel">
              <thead>
                <tr className="tabel-head">
                  <th style={{ width: "6%", textAlign: "center" }}>NO</th>
                  <th style={{ width: "10%", textAlign: "center" }}>FOTO</th>
                  <th style={{ width: "34%", textAlign: "left" }}>NAMA PRODUK</th>
                  <th style={{ width: "16%", textAlign: "left" }}>KATEGORI</th>
                  <th style={{ width: "14%", textAlign: "left" }}>HARGA</th>
                  <th style={{ width: "10%", textAlign: "center" }}>STOK</th>
                  <th style={{ width: "10%", textAlign: "center" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="state-info">
                      Memuat data produk dari database...
                    </td>
                  </tr>
                ) : currentProduk.length > 0 ? (
                  currentProduk.map((item, index) => {
                    const stokNum = Number(item.stok) || 0;
                    let stokClass = "aman";
                    if (stokNum === 0) {
                      stokClass = "habis";
                    } else if (stokNum <= 3) {
                      stokClass = "kritis";
                    }

                    const nomorUrut = indexOfFirstItem + index + 1;

                    return (
                      <tr
                        key={item.id}
                        className="tabel-row"
                        onClick={() => router.push(`/checkout/${item.id}`)}
                      >
                        <td style={{ textAlign: "center", fontWeight: 600, color: "#64748b" }}>
                          {nomorUrut}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
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
                                <span className="no-image-text">No Img</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <div className="col-nama-main">{item.nama}</div>
                          <div className="col-nama-sub">
                            {item.deskripsi ? item.deskripsi : (item.sku ? `SKU: ${item.sku}` : "-")}
                          </div>
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <span className="kategori-badge">{item.kategori || "-"}</span>
                        </td>
                        <td style={{ textAlign: "left", fontWeight: 700, color: "#0f172a" }}>
                          {formatRupiah(item.harga)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className={`stok-badge ${stokClass}`}>
                            {item.stok}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <div className="aksi-wrapper">
                            <Link href={`/admin/produk/edit/${item.id}`} className="btn-aksi btn-edit" title="Edit">
                              ✏️ Edit
                            </Link>
                            <button
                              className="btn-aksi btn-hapus"
                              onClick={(e) => handleDelete(e, item.id)}
                              title="Hapus"
                            >
                              🗑 Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="state-info">
                      Tidak ada produk yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="footer-info">
              
              <span>Baris per halaman:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="footer-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
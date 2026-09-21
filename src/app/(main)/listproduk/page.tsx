"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Produk {
  id: number;
  nama: string;
  ukuran: string;
  harga: number;
  image: string;
  kategori: string;
}

export default function KatalogProduk() {
  const [daftarProduk, setDaftarProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJenis, setSelectedJenis] = useState<string[]>([]);
  const [selectedUkuran, setSelectedUkuran] = useState<string[]>([]);
  const [minHargaInput, setMinHargaInput] = useState("");
  const [maksHargaInput, setMaksHargaInput] = useState("");

  const searchParams = useSearchParams();
  const kategoriAktif = searchParams.get("kategori") || "Semua";

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    async function ambilData() {
      try {
        const res = await fetch("http://localhost/api/get_produk.php", {
          cache: "no-store",
        });
        const data = await res.json();
        setDaftarProduk(data);
      } catch (error) {
        console.error("Gagal mengambil data dari backend PHP:", error);
      } finally {
        setLoading(false);
      }
    }

    ambilData();
  }, []);

  const handleJenisChange = (item: string) => {
    setSelectedJenis((prev) =>
      prev.includes(item) ? prev.filter((j) => j !== item) : [...prev, item]
    );
  };

  const handleUkuranClick = (size: string) => {
    setSelectedUkuran((prev) =>
      prev.includes(size) ? prev.filter((u) => u !== size) : [...prev, size]
    );
  };

  const handleResetFilter = () => {
    setSelectedJenis([]);
    setSelectedUkuran([]);
    setMinHargaInput("");
    setMaksHargaInput("");
    setSearchQuery("");
  };

  const produkFiltered = daftarProduk.filter((item) => {
    const kategoriItem = item.kategori?.toLowerCase().trim() || "";

    const matchKategoriURL =
      kategoriAktif === "Semua" || !kategoriAktif
        ? true
        : kategoriItem === kategoriAktif.toLowerCase().trim();

    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());

    const matchJenis =
      selectedJenis.length === 0 ||
      selectedJenis.some((j) => 
        kategoriItem === j.toLowerCase().trim()
      );

    const matchUkuran =
      selectedUkuran.length === 0 ||
      selectedUkuran.some((u) => {
        if (!item.ukuran) return false;
        const daftarUkuranProduk = item.ukuran
          .toString()
          .toLowerCase()
          .split(/[\s,/-]+/)
          .map((val) => val.trim());

        return daftarUkuranProduk.includes(u.toLowerCase().trim());
      });

    const minHargaVal = minHargaInput ? Number(minHargaInput) : 0;
    const maksHargaVal = maksHargaInput ? Number(maksHargaInput) : Infinity;
    const matchHarga = item.harga >= minHargaVal && item.harga <= maksHargaVal;

    return matchKategoriURL && matchSearch && matchJenis && matchUkuran && matchHarga;
  });

  return (
    <>
      <style jsx>{`
        .catalog-page {
          min-height: 100vh;
          background-color: #edf5ff;
          padding-top: 70px;
          padding-bottom: 60px;
        }
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .top-search-section {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }
        .search-container {
          display: flex;
          gap: 8px;
          width: 100%;
          max-width: 500px;
        }
        .search-input {
          flex: 1;
          height: 42px;
          padding: 0 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          font-size: 14px;
          background: #ffffff;
        }
        .search-input:focus {
          border-color: #000000;
        }
        .search-btn {
          padding: 0 18px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .layout-grid {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .sidebar {
          width: 220px;
          flex-shrink: 0;
        }
        .filter-card {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }
        .filter-title {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          margin-top: 16px;
          text-align: center;
        }
        .filter-title:first-child {
          margin-top: 0;
        }
        .checkbox-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #374151;
          cursor: pointer;
        }
        .checkbox-input {
          width: 15px;
          height: 15px;
          cursor: pointer;
        }
        .size-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 20px;
        }
        .size-item {
          height: 32px;
          background: #e5e7eb;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .size-item.active {
          background: #000000;
          color: #ffffff;
          font-weight: 700;
        }
        .harga-container {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        .input-harga {
          width: 100%;
          height: 32px;
          padding: 0 6px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 11px;
          outline: none;
          text-align: center;
        }
        .btn-gunakan {
          width: 100%;
          background: #1642d7;
          color: #ffffff;
          padding: 8px 0;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        }

        .content-area {
          flex: 1;
          min-width: 0; /* Mencegah flex child keluar dari kontainer */
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .product-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          cursor: pointer;
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 320px;
          box-sizing: border-box;
          min-width: 0; /* Penting agar flex item tidak merusak grid/card */
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }
        .card-header {
          display: flex;
          justify-content: flex-start;
        }
        .badge-stock {
          background: #dcfce7;
          color: #16a34a;
          font-size: 9px;
          font-weight: 700;
          padding: 4px 6px;
          border-radius: 4px;
        }
        .card-img-container {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px 0;
        }
        .card-img-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0; /* Penting untuk menangani teks panjang di dalam flex */
        }
        .brand-name {
          font-size: 12px;
          font-weight: 700;
          color: #1f2937;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%; /* Ditambahkan agar ellipsis berfungsi optimal */
          display: block;  /* Ditambahkan agar block-level membatasi lebar */
          margin: 0;
        }
        .size-info {
          font-size: 11px;
          color: #6b7280;
        }
        .product-price {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          margin-top: 4px;
          margin-bottom: 8px;
        }
        .btn-buy {
          width: 100%;
          background-color: #1642d7;
          color: #ffffff;
          border: none;
          padding: 8px 0;
          border-radius: 6px;
          font-weight: 700;
          font-size: 11px;
          cursor: pointer;
        }
        .no-product-msg {
          background: #ffffff;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      `}</style>

      <div className="catalog-page">
        <main className="main-content">
          {/* SEARCH BAR BARIS ATAS */}
          <div className="top-search-section">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search" 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>

          <div className="layout-grid">
            {/* SIDEBAR FILTER */}
            <aside className="sidebar">
              <div className="filter-card">
                <h2 className="filter-title">JENIS</h2>
                <div className="checkbox-group">
                  {['PRIA', 'WANITA', 'ANAK'].map((item) => (
                    <label key={item} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        className="checkbox-input" 
                        checked={selectedJenis.includes(item)}
                        onChange={() => handleJenisChange(item)}
                      /> {item}
                    </label>
                  ))}
                </div>
                
                <h2 className="filter-title">UKURAN</h2>
                <div className="size-grid">
                  {['39', '40', '41', '42', '43', '44', '45', '46'].map((size) => (
                    <div 
                      key={size} 
                      className={`size-item ${selectedUkuran.includes(size) ? 'active' : ''}`}
                      onClick={() => handleUkuranClick(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>

                <h2 className="filter-title">Harga</h2>
                <div className="harga-container">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input-harga"
                    value={minHargaInput}
                    onChange={(e) => setMinHargaInput(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Maks"
                    className="input-harga"
                    value={maksHargaInput}
                    onChange={(e) => setMaksHargaInput(e.target.value)}
                  />
                </div>

                <button className="btn-gunakan" onClick={handleResetFilter}>
                  Reset Filter
                </button>
              </div>
            </aside>

            <div className="content-area">
              {loading ? (
                <div className="no-product-msg">Memuat data produk...</div>
              ) : produkFiltered.length === 0 ? (
                <div className="no-product-msg">
                  Belum ada produk yang sesuai dengan filter atau pencarian Anda.
                </div>
              ) : (
                <section className="product-grid">
                  {produkFiltered.map((item) => (
                    <Link href={`/checkout/${item.id}`} key={item.id} style={{ textDecoration: 'none', minWidth: 0 }}>
                      <div className="product-card">
                        <div className="card-header">
                          <span className="badge-stock">READY STOK</span>
                        </div>
                        <div className="card-img-container">
                          <img src={`http://localhost/api/uploads/${item.image}`} alt={item.nama} />
                        </div>
                        <div className="card-body">
                          <h2 className="brand-name" title={item.nama}>{item.nama}</h2>
                          <p className="size-info">Ready Size : {item.ukuran}</p>
                          <div className="product-price">
                            Rp {Number(item.harga).toLocaleString("id-ID")}
                          </div>
                        </div>
                        <button className="btn-buy">BELI SEKARANG</button>
                      </div>
                    </Link>
                  ))}
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
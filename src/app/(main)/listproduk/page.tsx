"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ProdukType {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  ukuran: string;
  stok: number;
  image: string;
}

const SEPATU_KEYWORDS = [
  "sepatu",
  "sneakers",
  "futsal",
  "bola",
  "lari",
  "running",
  "specs",
  "ortuseight",
];

const APPAREL_KEYWORDS = [
  "baju",
  "kaos",
  "kaus",
  "jersey",
  "kaos kaki",
  "kaus kaki",
  "sock",
  "celana",
  "hoodie",
  "jaket",
  "topi",
  "tas",
  "aksesoris",
  "apparel",
];

function isProdukSepatu(nama: string, kategori: string): boolean {
  const teks = `${nama} ${kategori}`.toLowerCase();
  if (
    teks.includes("kaos kaki") ||
    teks.includes("kaus kaki") ||
    teks.includes("baju") ||
    teks.includes("kaos") ||
    teks.includes("kaus") ||
    teks.includes("jersey") ||
    teks.includes("aksesoris") ||
    teks.includes("apparel")
  ) {
    return false;
  }
  return SEPATU_KEYWORDS.some((k) => teks.includes(k));
}

function isProdukApparel(nama: string, kategori: string): boolean {
  const teks = `${nama} ${kategori}`.toLowerCase();
  if (isProdukSepatu(nama, kategori)) return false;
  return APPAREL_KEYWORDS.some((k) => teks.includes(k));
}

export default function KatalogProduk() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProdukType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedJenis, setSelectedJenis] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [selectedUkuran, setSelectedUkuran] = useState<string[]>([]);
  const [minHarga, setMinHarga] = useState("");
  const [maxHarga, setMaxHarga] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [navKategori, setNavKategori] = useState("");

  const [appliedFilter, setAppliedFilter] = useState({
    jenis: [] as string[],
    brand: [] as string[],
    ukuran: [] as string[],
    minHarga: "",
    maxHarga: "",
    search: "",
    navKategori: "",
  });

  useEffect(() => {
    const brandUrl = searchParams.get("brand") || "";
    const searchUrl = searchParams.get("search") || "";
    const kategoriUrl = (
      searchParams.get("kategori") ||
      searchParams.get("jenis") ||
      searchParams.get("tab") ||
      ""
    )
      .toLowerCase()
      .trim();

    const nextJenis =
      kategoriUrl === "sepatu" || kategoriUrl === "sneakers"
        ? ["Sepatu"]
        : kategoriUrl === "apparel"
        ? []
        : kategoriUrl
        ? [kategoriUrl]
        : [];

    const nextBrand = brandUrl ? [brandUrl] : [];

    setSelectedJenis(nextJenis);
    setSelectedBrand(nextBrand);
    setSelectedUkuran([]);
    setMinHarga("");
    setMaxHarga("");
    setSearchKeyword(searchUrl);
    setNavKategori(kategoriUrl);

    setAppliedFilter({
      jenis: nextJenis,
      brand: nextBrand,
      ukuran: [],
      minHarga: "",
      maxHarga: "",
      search: searchUrl,
      navKategori: kategoriUrl,
    });

    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost/api/get_produk.php", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const formattedData = Array.isArray(data)
            ? data.map((item: any) => ({
                ...item,
                image: item.image
                  ? item.image.startsWith("http")
                    ? item.image
                    : `http://localhost/api/uploads/${item.image}`
                  : "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=60",
              }))
            : [];
          setProducts(formattedData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchParams]);

  const handleTerapkanFilter = () => {
    setAppliedFilter({
      jenis: selectedJenis,
      brand: selectedBrand,
      ukuran: selectedUkuran,
      minHarga,
      maxHarga,
      search: searchKeyword,
      navKategori,
    });
  };

  const handleResetFilter = () => {
    setSelectedJenis([]);
    setSelectedBrand([]);
    setSelectedUkuran([]);
    setMinHarga("");
    setMaxHarga("");
    setSearchKeyword("");
    setNavKategori("");

    setAppliedFilter({
      jenis: [],
      brand: [],
      ukuran: [],
      minHarga: "",
      maxHarga: "",
      search: "",
      navKategori: "",
    });
  };

  const filteredProducts = products.filter((p) => {
    const namaProduk = p.nama?.toLowerCase() || "";
    const kategoriProduk = p.kategori?.toLowerCase() || "";
    const ukuranProduk = p.ukuran?.toLowerCase() || "";
    const hargaProduk = Number(p.harga) || 0;

    if (appliedFilter.search) {
      const keyword = appliedFilter.search.toLowerCase();
      if (!namaProduk.includes(keyword) && !kategoriProduk.includes(keyword)) {
        return false;
      }
    }

    if (appliedFilter.navKategori === "sneakers" || appliedFilter.navKategori === "sepatu") {
      if (!isProdukSepatu(namaProduk, kategoriProduk)) {
        return false;
      }
    } else if (appliedFilter.navKategori === "apparel") {
      if (!isProdukApparel(namaProduk, kategoriProduk)) {
        return false;
      }
    }

    if (appliedFilter.jenis.length > 0) {
      const matchJenis = appliedFilter.jenis.some((j) => {
        const jLower = j.toLowerCase();
        if (jLower === "sepatu" || jLower === "sneakers") {
          return isProdukSepatu(namaProduk, kategoriProduk);
        }
        if (jLower === "apparel") {
          return isProdukApparel(namaProduk, kategoriProduk);
        }
        return kategoriProduk.includes(jLower) || namaProduk.includes(jLower);
      });
      if (!matchJenis) return false;
    }

    if (appliedFilter.brand.length > 0) {
      const matchBrand = appliedFilter.brand.some(
        (b) => namaProduk.includes(b.toLowerCase()) || kategoriProduk.includes(b.toLowerCase())
      );
      if (!matchBrand) return false;
    }

    if (appliedFilter.ukuran.length > 0 && appliedFilter.navKategori !== "apparel") {
      const matchUkuran = appliedFilter.ukuran.some((u) => ukuranProduk.includes(u));
      if (!matchUkuran) return false;
    }

    if (appliedFilter.minHarga && hargaProduk < Number(appliedFilter.minHarga)) return false;
    if (appliedFilter.maxHarga && hargaProduk > Number(appliedFilter.maxHarga)) return false;

    return true;
  });

  return (
    <div className="page-root">
      <style jsx>{`
        .page-root {
          width: 100%;
          min-height: 100vh;
          background-color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 0;
        }

        .breadcrumb {
          max-width: 1320px;
          margin: 0 auto;
          padding: 24px 32px 16px 32px;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .main-layout {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 32px 60px 32px;
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }

        .sidebar {
          width: 245px;
          flex-shrink: 0;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 18px;
          box-sizing: border-box;
        }

        .filter-title {
          font-size: 12px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .filter-title:not(:first-child) {
          margin-top: 22px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #334155;
          margin-bottom: 8px;
          cursor: pointer;
          font-weight: 400;
        }

        .checkbox-label input {
          width: 15px;
          height: 15px;
          accent-color: #0f172a;
          cursor: pointer;
          border-radius: 4px;
          margin: 0;
        }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }

        .size-box {
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          text-align: center;
          padding: 6px 0;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          background: #ffffff;
          color: #334155;
          transition: all 0.2s;
        }

        .size-box:hover,
        .size-box.active {
          border-color: #0f172a;
          background-color: #0f172a;
          color: #ffffff;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .price-inputs input {
          width: 100%;
          padding: 7px 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 12px;
          outline: none;
          color: #0f172a;
          box-sizing: border-box;
        }

        .filter-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .btn-apply {
          flex: 1;
          background-color: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          height: 30px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-apply:hover {
          opacity: 0.88;
        }

        .btn-reset {
          background-color: #f8fafc;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          height: 30px;
          padding: 0 10px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-reset:hover {
          background-color: #f1f5f9;
        }

        .content-area {
          flex: 1;
          min-width: 0;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .product-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
        }

        .card-img-container {
          width: 100%;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          background: #f8fafc;
          border-radius: 8px;
          padding: 8px;
          box-sizing: border-box;
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
          margin-bottom: 12px;
        }

        .brand-name {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .product-title {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.3;
          height: 34px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .stock-info {
          font-size: 11px;
          color: #64748b;
          margin-bottom: -20px;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .product-price {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
        }

        .btn-buy {
          width: 100%;
          background-color: #000000;
          color: #ffffff;
          border: none;
          padding: 5px 0;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          letter-spacing: 0.5px;
          transition: opacity 0.2s;
          height: 28px;
        }

        .btn-buy:hover {
          opacity: 0.85;
        }

        .empty-state {
          grid-column: span 4;
          text-align: center;
          padding: 40px;
          font-size: 13px;
          color: #64748b;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
        }

        @media (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .main-layout {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
          }
          .empty-state {
            grid-column: span 2;
          }
        }
      `}</style>

      <div className="breadcrumb">
        Beranda &gt; Katalog Produk
        {appliedFilter.navKategori && ` > ${appliedFilter.navKategori.toUpperCase()}`}
        {appliedFilter.search && ` > Pencarian: "${appliedFilter.search}"`}
      </div>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="filter-title">JENIS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {["Sepatu", "Aksesoris", "Jersey", "Kaos Kaki"].map((item) => (
              <label key={item} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedJenis.includes(item)}
                  onChange={() => {
                    setSelectedJenis((prev) =>
                      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
                    );
                  }}
                />
                {item}
              </label>
            ))}
          </div>

          <div className="filter-title">BRAND</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {["Nike", "Adidas", "New Balance", "Puma", "Ortuseight"].map((brand) => (
              <label key={brand} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedBrand.includes(brand)}
                  onChange={() => {
                    setSelectedBrand((prev) =>
                      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
                    );
                  }}
                />
                {brand}
              </label>
            ))}
          </div>

          <div className="filter-title">UKURAN</div>
          <div className="size-grid">
            {["30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42"].map((size) => (
              <div
                key={size}
                className={`size-box ${selectedUkuran.includes(size) ? "active" : ""}`}
                onClick={() => {
                  setSelectedUkuran((prev) =>
                    prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                  );
                }}
              >
                {size}
              </div>
            ))}
          </div>

          <div className="filter-title">HARGA</div>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minHarga}
              onChange={(e) => setMinHarga(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxHarga}
              onChange={(e) => setMaxHarga(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <button type="button" className="btn-apply" onClick={handleTerapkanFilter}>
              Terapkan
            </button>
            <button type="button" className="btn-reset" onClick={handleResetFilter}>
              Reset
            </button>
          </div>
        </aside>

        <main className="content-area">
          <div className="product-grid">
            {loading ? (
              <div className="empty-state">Memuat data produk...</div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="card-img-container">
                    <img src={p.image} alt={p.nama} />
                  </div>

                  <div className="card-body">
                    <span className="brand-name">{p.kategori || "SEPATU"}</span>
                    <h3 className="product-title">{p.nama}</h3>
                    <p className="stock-info">Stok : {p.stok ?? "-"}</p>
                  </div>

                  <div className="card-footer">
                    <div className="product-price">Rp {Number(p.harga).toLocaleString("id-ID")}</div>
                    <button className="btn-buy" onClick={() => router.push(`/checkout/${p.id}`)}>
                      BELI SEKARANG
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Produk tidak ditemukan</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
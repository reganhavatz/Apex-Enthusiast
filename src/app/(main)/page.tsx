"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Produk {
  id: number;
  nama: string;
  ukuran: string;
  harga: number;
  image: string;
  kategori: string;
  deskripsi?: string;
}

export default function Home() {
  const [listProduk, setListProduk] = useState<Produk[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function ambilData() {
      try {
        const res = await fetch("http://localhost/api/get_produk.php", { cache: "no-store" });
        const data = await res.json();
        setListProduk(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    }
    ambilData();
  }, []);

  const produkHero = listProduk.find((p) => Number(p.id) === 11);
  const produkSpec = listProduk.find((p) => Number(p.id) === 11);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listproduk?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/listproduk`);
    }
  };

  return (
    <div className="home-wrapper">
      <style jsx>{`
        .main-container {
          max-width: 200px; 
          margin: 0 auto;    
          width: 100%;
        }

        .hero-section {
          width: 1275px;
          background-color: #38bdf8;
          color: #ffffff;
          padding: 60px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          box-sizing: border-box;
        }

        .hero-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-image img {
          width: 100%;
          max-width: 480px;
          height: auto;
          object-fit: contain;
        }

        .hero-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .hero-content h1 {
          font-size: 32px;
          font-weight: 900;
          text-transform: uppercase;
          margin-left:20px;
          margin-bottom:10px;
          letter-spacing: 0.5px;
          color: #ffffff;

        }

        .hero-content p {
          font-size: 13px;
          line-height: 1.6;
          color: #f0f9ff;
          margin: 0 0 24px 0;
          max-width: 500px;
        }

        .btn-primary {
          background-color: #ffffff;
          color: #0284c7;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary:hover {
          background-color: #f1f5f9;
        }

        .container-content {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .search-section {
          text-align: center;
          margin: 40px 0 30px 0;
        }

        .search-title {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .search-box-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          max-width: 450px;
          margin: 0 auto;
        }

        .search-input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          outline: none;
          background-color: #f8fafc;
        }

        .search-btn {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .feature-card {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          height: 80px;
          box-sizing: border-box;
        }

        .feature-icon {
          width: 32px;
          height: 32px;
          color: #0284c7;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-icon svg {
          width: 22px;
          height: 22px;
        }

        .feature-title {
          font-size: 11px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px 0;
        }

        .feature-desc {
          font-size: 10px;
          color: #64748b;
          margin: 0;
        }

        .spec-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
          align-items: center;
          margin-top: 50px;
        }

        .spec-image-container {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          height: 340px;
          background-color: #f8fafc;
        }

        .spec-image-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .badge-lab {
          position: absolute;
          top: 16px;
          left: 16px;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dot-blue {
          width: 6px;
          height: 6px;
          background-color: #0284c7;
          border-radius: 50%;
        }

        .badge-bottom {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background-color: rgba(15, 23, 42, 0.85);
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 12px;
        }

        .spec-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .spec-subtitle {
          font-size: 10px;
          font-weight: 800;
          color: #0284c7;
          letter-spacing: 0.5px;
        }

        .spec-heading {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          margin: 4px 0 8px 0;
        }

        .spec-intro {
          font-size: 11px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        .spec-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .spec-item-card {
          background-color: #f8fafc;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .spec-icon-box {
          width: 32px;
          height: 32px;
          background-color: #e0f2fe;
          color: #0284c7;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .spec-icon-box svg {
          width: 16px;
          height: 16px;
        }

        .spec-item-body {
          flex: 1;
        }

        .spec-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .spec-item-title {
          font-size: 12px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .spec-tag {
          background-color: #e0f2fe;
          color: #0369a1;
          font-size: 8px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .spec-item-desc {
          font-size: 10px;
          color: #64748b;
          margin: 4px 0 0 0;
          line-height: 1.4;
        }

        /* DARK BANNER */
        .dark-banner {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background-color: #1e293b;
          color: #ffffff;
          padding: 44px;
          margin-top: 50px;
          min-height: 180px;
          display: flex;
          align-items: center;
        }

        .dark-banner-bg {
          position: absolute;
          inset: 0;
          opacity: 0.3;
          background-size: cover;
          background-position: center;
        }

        .dark-banner-content {
          position: relative;
          z-index: 10;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dark-banner-sub {
          font-size: 9px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 1px;
        }

        .dark-banner-title {
          font-size: 24px;
          font-weight: 900;
          line-height: 1.2;
          margin: 0;
        }

        .dark-banner-desc {
          font-size: 11px;
          color: #cbd5e1;
          line-height: 1.5;
          margin: 0;
        }

        .product-container {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 50px;
          margin-bottom: 50px;
        }

        .product-card {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 330px;
          box-sizing: border-box;
          transition: transform 0.2s;
        }

        .product-card:hover {
          transform: translateY(-2px);
        }

        .badge-stock {
          background: #dcfce7;
          color: #16a34a;
          font-size: 9px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .card-img-container {
          height: 130px;
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
          gap: 2px;
        }

        .product-title {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }

        .size-info {
          font-size: 10px;
          color: #64748b;
          margin: 2px 0;
        }

        .product-price {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .btn-buy {
          width: 100%;
          background-color: #1642d7;
          color: #ffffff;
          border: none;
          padding: 8px 0;
          border-radius: 6px;
          font-weight: 800;
          font-size: 10px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column;
            padding: 40px 20px;
          }
          .hero-content {
            align-items: center;
            text-align: center;
          }
          .spec-section {
            grid-template-columns: 1fr;
          }
          .features-grid, .product-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-image">
          <img
            src={produkHero?.image ? `http://localhost/api/uploads/${produkHero.image}` : "/ortus.png"}
            alt="Produk Hero"
          />
        </div>

        <div className="hero-content">
          <h1>{produkHero?.nama || "ORTUSEIGHT"}</h1>
          <p style={{ whiteSpace: "pre-line" }}>
            {produkHero?.deskripsi ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
          </p>
          <Link href={"/listproduk"}>
          <button className="btn-primary">Kunjungi</button>
          </Link>
          
        </div>
      </section>

      <div className="container-content">

        <section className="search-section">
          <h2 className="search-title">CARI PRODUK YANG INGIN ANDA TEMUKAN</h2>
          <form onSubmit={handleSearch} className="search-box-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h4 className="feature-title">Authentic 100%</h4>
              <p className="feature-desc">Jaminan produk original.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div>
              <h4 className="feature-title">Ready Stock</h4>
              <p className="feature-desc">Barang fisik siap dikirim.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" /></svg>
            </div>
            <div>
              <h4 className="feature-title">Packing Aman</h4>
              <p className="feature-desc">Bubble wrap & double box.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h4 className="feature-title">Pengiriman Cepat</h4>
              <p className="feature-desc">Proses instan & kirim ke seluruh...</p>
            </div>
          </div>
        </section>

        <section className="spec-section">
          <div className="spec-image-container">
            <img
              src={produkSpec?.image ? `http://localhost/api/uploads/${produkSpec.image}` : "/outsole.jpg"}
              alt="Sole Sepatu"
            />
          </div>

          <div className="spec-content">
            <div>
              <span className="spec-subtitle">REKOMENDASI PERFORMA</span>
              <h2 className="spec-heading">Review & Spesifikasi<br />Sepatu</h2>
              <p className="spec-intro">
                Keunggulan utama seri pilihan yang menjadikannya favorit para pemain futsal profesional:
              </p>
            </div>

            <div className="spec-items">
              <div className="spec-item-card">
                <div className="spec-icon-box">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" /></svg>
                </div>
                <div className="spec-item-body">
                  <div className="spec-item-header">
                    <h4 className="spec-item-title">Premium Leather Upper</h4>
                    <span className="spec-tag">SENSITIVITAS SENTUHAN</span>
                  </div>
                  <p className="spec-item-desc">Bahan kulit asli/sintetis super lembut untuk sentuhan bola yang presisi dan nyaman di kaki.</p>
                </div>
              </div>

              <div className="spec-item-card">
                <div className="spec-icon-box">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" /></svg>
                </div>
                <div className="spec-item-body">
                  <div className="spec-item-header">
                    <h4 className="spec-item-title">Bantalan Lunarlon</h4>
                    <span className="spec-tag">PEREDAM HENTAKAN</span>
                  </div>
                  <p className="spec-item-desc">Busa empuk khas Nike yang meredam benturan di lapangan semen atau vinyl keras.</p>
                </div>
              </div>

              <div className="spec-item-card">
                <div className="spec-icon-box">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </div>
                <div className="spec-item-body">
                  <div className="spec-item-header">
                    <h4 className="spec-item-title">Sol Rubber IC</h4>
                    <span className="spec-tag">TERMOREGULASI</span>
                  </div>
                  <p className="spec-item-desc">Grip karet berkualitas tinggi yang tidak licin saat kamu melakukan manuver tajam.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dark-banner">
          <div className="dark-banner-bg" style={{ backgroundImage: "url('/banner-bg.jpg')" }}></div>
          <div className="dark-banner-content">
            <span className="dark-banner-sub">AMANKAN SEPATU IMPIANMU</span>
            <h2 className="dark-banner-title">
              TANGKAS DI LAPANGAN,<br />
              TAMPIL MAKIN PEDE
            </h2>
            <p className="dark-banner-desc">
              Dapatkan koleksi sepatu futsal & sepak bola original terlengkap dari brand ternama. Stok terbatas, beli sekarang sebelum kehabisan!
            </p>
          </div>
        </section>

        <div className="product-container">
          {listProduk.slice(0, 4).map((item) => (
            <Link href={`/checkout/${item.id}`} key={item.id} className="product-card-link">
              <div className="product-card">
                <div className="card-header">
                  <span className="badge-stock">READY STOK</span>
                </div>

                <div className="card-img-container">
                  <img
                    src={`http://localhost/api/uploads/${item.image}`}
                    alt={item.nama}
                  />
                </div>

                <div className="card-body">
                  <p className="product-title">{item.nama}</p>
                  <p className="size-info">Ready Size : {item.ukuran}</p>
                  <div className="product-price">
                    Rp {Number(item.harga).toLocaleString("id-ID")}
                  </div>
                </div>

                <button className="btn-buy" onClick={(e) => {
                }}>
                  BELI SEKARANG
                </button>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
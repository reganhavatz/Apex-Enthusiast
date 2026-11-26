"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

interface ProdukType {
  id: number | string;
  nama: string;
  kategori: string;
  harga: number | string;
  ukuran: string;
  stok: number | string;
  image: string;
}

interface HeroType {
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
}

const DEFAULT_HERO: HeroType = {
  title: "APEX ENTHUSIAST STORE",
  description: "Koleksi Eksklusif Sepatu & Apparel Terbaik di Indonesia",
  buttonText: "Jelajahi Produk",
  imageUrl: "",
  bgColor: "#18181b",
  textColor: "#ffffff",
  buttonBgColor: "#ffffff",
  buttonTextColor: "#000000",
};

function HomeContent() {
  const router = useRouter();

  const [products, setProducts] = useState<ProdukType[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState<HeroType>(DEFAULT_HERO);

  useEffect(() => {
    async function fetchDatabaseProducts() {
      try {
        const res = await fetch("http://localhost/api/get_produk.php", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : [];

          const formattedData: ProdukType[] = list.map((item: any) => ({
            ...item,
            image: item.image
              ? item.image.startsWith("http")
                ? item.image
                : `http://localhost/api/uploads/${String(item.image)
                    .replace(/^\/?api\/uploads\//, "")
                    .replace(/^uploads\//, "")}`
              : "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=60",
          }));
          setProducts(formattedData);
        }
      } catch (err) {
        console.error("Gagal ambil produk:", err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchHeroBanner() {
      const localHero = localStorage.getItem("apex_hero_config");
      if (localHero) {
        try {
          const parsed = JSON.parse(localHero);
          if (parsed && typeof parsed === "object") {
            setHeroData((prev) => ({ ...prev, ...parsed }));
          }
        } catch {
          // Abaikan jika JSON lokal tidak valid
        }
      }

      try {
        const res = await fetch("http://localhost/api/get_hero.php", {
          cache: "no-store",
        });
        const text = await res.text();

        if (!text.startsWith("<")) {
          const data = JSON.parse(text);
          if (data && typeof data === "object") {
            const nextHero: HeroType = {
              title: data.title || DEFAULT_HERO.title,
              description: data.description || DEFAULT_HERO.description,
              buttonText: data.buttonText || DEFAULT_HERO.buttonText,
              imageUrl: data.imageUrl ?? DEFAULT_HERO.imageUrl,
              bgColor: data.bgColor || DEFAULT_HERO.bgColor,
              textColor: data.textColor || DEFAULT_HERO.textColor,
              buttonBgColor: data.buttonBgColor || DEFAULT_HERO.buttonBgColor,
              buttonTextColor: data.buttonTextColor || DEFAULT_HERO.buttonTextColor,
            };
            setHeroData(nextHero);
            localStorage.setItem("apex_hero_config", JSON.stringify(nextHero));
          }
        }
      } catch (err) {
        console.error("Gagal ambil hero:", err);
      }
    }

    fetchDatabaseProducts();
    fetchHeroBanner();
  }, []);

  const handleBrandClick = (brandName: string) => {
    router.push(`/listproduk?brand=${encodeURIComponent(brandName)}`);
  };

  const runningList = products.filter((p) => {
    const kat = p.kategori?.toLowerCase() || "";
    return (
      kat.includes("sepatu") ||
      kat.includes("lari") ||
      kat.includes("running") ||
      kat.includes("sneaker") ||
      kat.includes("futsal") ||
      kat.includes("bola")
    );
  });

  const apparelList = products.filter((p) => {
    const kat = p.kategori?.toLowerCase() || "";
    return (
      kat.includes("baju") ||
      kat.includes("jersey") ||
      kat.includes("apparel") ||
      kat.includes("hoodie") ||
      kat.includes("kaos") ||
      kat.includes("celana")
    );
  });

  return (
    <div className="home-wrapper">
      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #ffffff;
          color: #000000;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
      `}</style>

      <style jsx>{`
        .home-wrapper {
          width: 1250px;
          min-height: 100vh;
          margin: 10px;
        }
        .sub-nav {
          padding: 12px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          color: white;
          background-color: black;
          height: 30px;
          width: 1275px;
          margin-left: -20px;
          margin-top: -10px;
        }
        .sub-nav-left {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .sub-nav-left a {
          text-decoration: none;
          color: #ffffff;
          cursor: pointer;
        }
        .sub-nav-right {
          color: #ffffff;
          display: flex;
          gap: 16px;
          font-size: 11px;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
        }
        .hero-banner {
          border-radius: 12px;
          border: 2px solid gray;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 40px;
          height: 360px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .hero-content {
          max-width: 600px;
          z-index: 2;
        }
        .hero-tag {
          font-size: 10px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }
        .hero-title {
          font-size: 30px;
          font-weight: 800;
          line-height: 1.15;
          margin: 0 0 10px 0;
          letter-spacing: -0.5px;
        }
        .hero-price {
          font-size: 13px;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .btn-banner {
          padding: 10px 22px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }
        .sec-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 40px;
          margin-bottom: 6px;
        }
        .sec-title {
          font-size: 18px;
          font-weight: 800;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: -0.3px;
        }
        .sec-link {
          font-size: 11px;
          font-weight: 700;
          color: #000000;
          text-decoration: none;
          cursor: pointer;
        }
        .sec-desc {
          font-size: 12px;
          color: #71717a;
          margin: 0 0 20px 0;
        }
        .brand-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 40px;
        }
        .brand-card {
          border: 1px solid #0000;
          border-radius: 8px;
          padding: 18px 10px;
          text-align: center;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100px;
        }
        .brand-card:hover {
          border-color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .brand-logo-container {
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }
        .brand-logo-container svg {
          max-height: 45px;
          width: auto;
          fill: #000000;
        }
        .brand-card h4 {
          font-size: 12px;
          font-weight: 800;
          margin: 0;
          color: #000000;
          letter-spacing: 0.3px;
        }
        .product-grid-4 {
          display: flex;
          flex-direction: row;
          gap: 25px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .p-card {
          background: #ffffff;
          border: 1px solid #d4d4d8;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 220px;
          height: 320px;
        }
        .p-img {
          width: 100%;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
        }
        .p-img img {
          max-width: 100%;
          max-height: 140px;
          object-fit: contain;
        }
        .p-brand {
          font-size: 11px;
          font-weight: 500;
          color: #000000;
          margin: -10px 0 4px 5px;
        }
        .p-title {
          font-size: 14px;
          font-weight: 700;
          color: #000000;
          margin: 0 0 6px 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .p-stock {
          font-size: 11px;
          color: #000000;
          margin: 0 0 -10px 5px;
        }
        .p-price {
          font-size: 16px;
          font-weight: 600;
          color: #000000;
          margin-bottom: 10px;
          margin-left: 5px;
          margin-top: -70px;
        }
        .btn-buy {
          width: 190px;
          background-color: #000000;
          color: #ffffff;
          border: none;
          padding: 5px 0;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          height: 28px;
          margin-left: 5px;
          margin-top: -10px;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          font-size: 13px;
          color: #71717a;
          background: #fafafa;
          border: 1px dashed #d4d4d8;
          border-radius: 8px;
          width: 100%;
        }
        .trust-section {
          background: #fafafa;
          border-radius: 12px;
          padding: 36px;
          text-align: center;
          margin: 40px 0;
          border: 1px solid #f4f4f5;
        }
        .trust-badge {
          background: #000000;
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
          margin-bottom: 10px;
        }
        .trust-title {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: #000000;
        }
        .trust-desc {
          font-size: 12px;
          color: #71717a;
          margin-bottom: 28px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          text-align: left;
        }
        .trust-card {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 18px;
        }
        .trust-card h4 {
          font-size: 12px;
          font-weight: 800;
          margin: 8px 0 6px 0;
          color: #000000;
        }
        .trust-card p {
          font-size: 11px;
          color: #71717a;
          margin: 0;
          line-height: 1.4;
        }
        .stats-bar {
          background: #000000;
          color: #ffffff;
          border-radius: 12px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 30px;
          text-align: center;
          margin-bottom: 40px;
        }
        .stat-box h3 {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        .stat-box p {
          font-size: 10px;
          color: #a1a1aa;
          margin: 0;
        }
      `}</style>

      <div className="sub-nav">
        <div className="sub-nav-left">
          <a onClick={() => router.push("/listproduk?kategori=sneakers")} className="active">
            Sneakers
          </a>
          <a onClick={() => router.push("/listproduk?kategori=apparel")}>Apparel</a>
        </div>
        <div className="sub-nav-right">
          <span>✓ 100% Terverifikasi Autentik</span>
          <span>✓ Verifikasi Ganda</span>
        </div>
      </div>

      <div className="container">
        {/* HERO BANNER */}
        <div
          className="hero-banner"
          style={{
            backgroundColor: heroData.bgColor,
            backgroundImage: heroData.imageUrl
              ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${heroData.imageUrl}')`
              : "none",
          }}
        >
          <div className="hero-content" style={{ color: heroData.textColor }}>
            <span
              className="hero-tag"
              style={{
                backgroundColor: heroData.buttonBgColor,
                color: heroData.buttonTextColor,
              }}
            >
              SOROTAN RILIS SPESIAL
            </span>
            <h1 className="hero-title" style={{ color: heroData.textColor }}>
              {heroData.title}
            </h1>
            <div className="hero-price" style={{ color: heroData.textColor }}>
              {heroData.description}
            </div>
            <button
              className="btn-banner"
              style={{
                backgroundColor: heroData.buttonBgColor,
                color: heroData.buttonTextColor,
              }}
              onClick={() => router.push("/listproduk")}
            >
              {heroData.buttonText}
            </button>
          </div>
        </div>

        <div className="sec-header">
          <h2 className="sec-title">Fokus Brand</h2>
          <span className="sec-link" onClick={() => router.push("/listproduk")}>
            SEMUA BRAND →
          </span>
        </div>
        <p className="sec-desc">
          Eksplorasi kurasi rilis ikonik dari brand sneaker &amp; streetwear legendaris
        </p>

        <div className="brand-grid">
          <div className="brand-card" onClick={() => handleBrandClick("Nike")}>
            <div className="brand-logo-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="55" height="40" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M24 7.8L6.442 15.276q-2.184.925-3.668.925q-1.68 0-2.437-1.177q-.475-.756-.28-1.918q.196-1.162 1.036-2.478q.7-1.065 2.297-2.8a6.1 6.1 0 0 0-.784 1.848q-.42 1.792.756 2.632q.56.392 1.54.392q.783 0 1.764-.252z"
                />
              </svg>
            </div>
            <h4>NIKE</h4>
          </div>

          <div className="brand-card" onClick={() => handleBrandClick("Adidas")}>
            <div className="brand-logo-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="55" height="40" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="m1.33 19l-.6-1.036l4.33-2.5L7.103 19zm13.856 0H9.412l-3.619-6.268l4.33-2.5zm8.083 0h-5.774l-6.64-11.5l4.33-2.5z"
                />
              </svg>
            </div>
            <h4>ADIDAS</h4>
          </div>

          <div className="brand-card" onClick={() => handleBrandClick("New Balance")}>
            <div className="brand-logo-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="m12.169 10.306l1.111-1.937l3.774-.242l.132-.236l-3.488-.242l.82-1.414h6.47c1.99 0 3.46.715 2.887 2.8c-.17.638-.979 2.233-3.356 2.899c.507.06 1.76.616 1.54 2.057c-.384 2.558-3.69 3.774-5.533 3.774l-7.641.006l-.38-1.48l4.005-.28l.137-.237l-4.346-.264l-.467-1.755l6.178-.363l.137-.231l-11.096-.693l.534-.925l11.948-.775l.138-.231zm5 .385l1.1-.006c.738-.005 1.502-.34 1.783-1.018c.259-.632-.088-1.171-.55-1.166h-1.067zm-1.27 2.195l-1.326 2.305h1.265c.589 0 1.64-.292 1.964-1.128c.302-.781-.253-1.177-.638-1.177zM6.26 16.445l-.77 1.315l-5.49.01l.534-.923zm.385-10.216l4.417.006l.336 1.248l-5.276-.33zm5 2.245l.484 1.832l-7.542-.495l.528-.92zm-3.84 5.281l-.957 1.661l-5.32-.302l.534-.924z"
                />
              </svg>
            </div>
            <h4>NEW BALANCE</h4>
          </div>

          <div className="brand-card" onClick={() => handleBrandClick("Puma")}>
            <div className="brand-logo-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="55" height="40" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M23.845 3.008c-.417-.533-1.146-.106-1.467.08c-2.284 1.346-2.621 3.716-3.417 5.077c-.626 1.09-1.652 1.89-2.58 1.952c-.686.049-1.43-.084-2.168-.405c-1.807-.781-2.78-1.792-3.017-1.97c-.487-.37-4.23-4.015-7.28-4.164c0 0-.372-.75-.465-.763c-.222-.025-.45.451-.616.501c-.15.053-.413-.512-.565-.487c-.153.02-.302.586-.6.877c-.22.213-.486.2-.637.463c-.052.096-.034.265-.093.42c-.127.32-.551.354-.555.697c0 .381.357.454.669.72c.248.212.265.362.554.461c.258.088.632-.187.964-.088c.277.081.543.14.602.423c.054.256 0 .658-.34.613c-.112-.015-.598-.174-1.198-.11c-.725.077-1.553.309-1.634 1.11c-.041.447.514.97 1.055.866c.371-.071.196-.506.399-.716c.267-.27 1.772.944 3.172.944c.593 0 1.031-.15 1.467-.605c.04-.029.093-.102.155-.11a.6.6 0 0 1 .195.088c1.131.897 1.984 2.7 6.13 2.721c.582.007 1.25.279 1.796.777c.48.433.764 1.125 1.037 1.825c.418 1.053 1.161 2.069 2.292 3.203c.06.068.99.78 1.06.833c.012.01.084.167.053.255c-.02.69-.123 2.67 1.365 2.753c.366.02.275-.231.275-.41c-.005-.341-.065-.685.113-1.04c.253-.478-.526-.709-.509-1.756c.019-.784-.645-.651-.984-1.25c-.19-.343-.368-.532-.35-.946c.073-2.38-.517-3.948-.805-4.327c-.227-.294-.423-.403-.207-.54c1.24-.815 1.525-1.574 1.525-1.574c.66-1.541 1.256-2.945 2.075-3.57c.166-.12.589-.44.852-.56c.763-.362 1.173-.578 1.388-.788c.356-.337.635-1.053.294-1.48"
                />
              </svg>
            </div>
            <h4>PUMA</h4>
          </div>

          <div className="brand-card" onClick={() => handleBrandClick("Ortuseight")}>
            <div className="brand-logo-container">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <h4>ORTUSEIGHT</h4>
          </div>
        </div>

        <div className="sec-header">
          <h2 className="sec-title">Koleksi Produk Terbaru</h2>
          <span className="sec-link" onClick={() => router.push("/listproduk")}>
            LIHAT SEMUA
          </span>
        </div>
        <p className="sec-desc">Kurasi sepatu pilihan dari database MySQL</p>

        <div className="product-grid-4">
          {loading ? (
            <div className="empty-state">Memuat data produk...</div>
          ) : products.length > 0 ? (
            products
              .slice(-4)
              .reverse()
              .map((p) => (
                <div className="p-card" key={p.id}>
                  <div>
                    <div className="p-img">
                      <img src={p.image} alt={p.nama} />
                    </div>
                    <div className="p-brand">{p.kategori || "SEPATU"}</div>
                    <h4 className="p-title">{p.nama}</h4>
                    <div className="p-stock">Stok : {p.ukuran || "-"}</div>
                  </div>
                  <div>
                    <div className="p-price">Rp {Number(p.harga).toLocaleString("id-ID")}</div>
                    <button className="btn-buy" onClick={() => router.push(`/checkout/${p.id}`)}>
                      BELI SEKARANG
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="empty-state">Data tidak tersedia</div>
          )}
        </div>

        <div className="trust-section">
          <span className="trust-badge">STANDAR OTENTISITAS NOMOR 1</span>
          <h2 className="trust-title">MENGAPA MEMILIH APEX ENTHUSIAST</h2>
          <p className="trust-desc">
            Kami menghadirkan ekosistem jual-beli sneakers dan apparel paling transparan, aman, dan
            tanpa rasa cemas di Indonesia.
          </p>

          <div className="trust-grid">
            <div className="trust-card">
              <div>🛡️</div>
              <h4>AUTENTIKASI MULTI-TAHAP TANPA KOMPROMI</h4>
              <p>
                Tim kurator dan spesialis autentikasi bersertifikasi memeriksa jahitan, sol,
                material UV, dan profiling aroma secara teliti sebelum produk dikirimkan ke tangan
                Anda.
              </p>
            </div>
            <div className="trust-card">
              <div>🔒</div>
              <h4>SISTEM ESCROW &amp; DANA AMAN 100%</h4>
              <p>
                Uang pembeli disimpan aman di rekening bersama dan baru diteruskan ke penjual setelah
                barang lolos uji fisik ketat di Hub autentikasi kami.
              </p>
            </div>
            <div className="trust-card">
              <div>🤝</div>
              <h4>JARINGAN KOLEKTOR &amp; BRAND TERPERCAYA</h4>
              <p>
                Akses ke rilisan langka, kolaborasi eksklusif, dan garansi uang kembali 200% jika
                terbukti tidak autentik oleh tim independen terverifikasi.
              </p>
            </div>
          </div>
        </div>

        <div className="sec-header">
          <h2 className="sec-title">Lari &amp; Performa</h2>
          <span className="sec-link" onClick={() => router.push("/listproduk")}>
            LIHAT SEMUA
          </span>
        </div>
        <p className="sec-desc">Bantalan kelas maraton, pelat karbon, dan sepatu lari harian</p>

        <div className="product-grid-4">
          {loading ? (
            <div className="empty-state">Memuat data...</div>
          ) : runningList.length > 0 ? (
            runningList.slice(0, 4).map((p) => (
              <div className="p-card" key={p.id}>
                <div>
                  <div className="p-img">
                    <img src={p.image} alt={p.nama} />
                  </div>
                  <div className="p-brand">{p.kategori || "SEPATU"}</div>
                  <h4 className="p-title">{p.nama}</h4>
                  <div className="p-stock">Stok : {p.ukuran || "-"}</div>
                </div>
                <div>
                  <div className="p-price">Rp {Number(p.harga).toLocaleString("id-ID")}</div>
                  <button className="btn-buy" onClick={() => router.push(`/checkout/${p.id}`)}>
                    BELI SEKARANG
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">Data tidak tersedia</div>
          )}
        </div>

        <div className="stats-bar">
          <div className="stat-box">
            <h3>500.000+</h3>
            <p>TRANSAKSI TERVERIFIKASI</p>
          </div>
          <div className="stat-box">
            <h3>99.98%</h3>
            <p>AKURASI AUTENTIKASI</p>
          </div>
          <div className="stat-box">
            <h3>4.9 / 5 ★</h3>
            <p>RATING KEPUASAN PEMBELI</p>
          </div>
        </div>

        <div className="sec-header">
          <h2 className="sec-title">Apparel &amp; Jersey Olahraga</h2>
          <span className="sec-link" onClick={() => router.push("/listproduk")}>
            JELAJAHI SEMUA APPAREL →
          </span>
        </div>
        <p className="sec-desc">Jersey klub autentik, jaket lari teknikal, hoodie, dan kaos</p>

        <div className="product-grid-4">
          {loading ? (
            <div className="empty-state">Memuat data...</div>
          ) : apparelList.length > 0 ? (
            apparelList.slice(0, 4).map((p) => (
              <div className="p-card" key={p.id}>
                <div>
                  <div className="p-img">
                    <img src={p.image} alt={p.nama} />
                  </div>
                  <div className="p-brand">{p.kategori || "APPAREL"}</div>
                  <h4 className="p-title">{p.nama}</h4>
                  <div className="p-stock">Stok : {p.ukuran || "-"}</div>
                </div>
                <div>
                  <div className="p-price">Rp {Number(p.harga).toLocaleString("id-ID")}</div>
                  <button className="btn-buy" onClick={() => router.push(`/checkout/${p.id}`)}>
                    BELI SEKARANG
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">Data tidak tersedia</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Memuat halaman...</div>}>
      <HomeContent />
    </Suspense>
  );
}
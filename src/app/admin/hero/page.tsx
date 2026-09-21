"use client";

import { useState, useEffect } from "react";

interface HeroData {
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  bgColor: string;
}

interface Produk {
  id: number;
  nama: string;
  image: string;
}

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroData>({
    title: "ORTUSEIGHT",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    buttonText: "Kunjungi",
    imageUrl: "/ortus.png",
    bgColor: "#38bdf8",
  });

  const [listProduk, setListProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 1. Ambil Data Hero saat ini
    fetch("http://localhost/api/get_hero.php", { cache: "no-store" })
      .then((res) => res.text())
      .then((text) => {
        if (!text.startsWith("<")) {
          const data = JSON.parse(text);
          if (data && data.title) setHero(data);
        }
      })
      .catch((err) => console.error("Gagal memuat data hero:", err));

    // 2. Ambil Daftar Produk dari Database untuk Opsi Dropdown Gambar
    fetch("http://localhost/api/get_produk.php", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListProduk(data);
        }
      })
      .catch((err) => console.error("Gagal memuat daftar produk:", err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost/api/update_hero.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hero),
      });

      const resText = await response.text();

      if (!resText.startsWith("<")) {
        const result = JSON.parse(resText);
        if (result.success) {
          alert("Hero section berhasil diperbarui!");
        } else {
          alert("Gagal memperbarui: " + (result.message || "Terjadi kesalahan"));
        }
      } else {
        alert("Terjadi kesalahan pada respon server (PHP Error)");
      }
    } catch (error) {
      console.error("Error updating hero:", error);
      alert("Gagal terhubung ke server PHP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-hero-container">
      <style jsx>{`
        .admin-hero-container {
          padding: 32px;
          max-width: 1280px;
          margin: 0 auto;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
        }

        .header-section {
          margin-bottom: 24px;
        }

        .header-section h1 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .header-section p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .grid-layout {
            grid-template-columns: 5fr 7fr;
          }
        }

        .card-box {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .card-title-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 16px;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .live-badge {
          font-size: 10px;
          background-color: #dcfce7;
          color: #15803d;
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 4px;
        }

        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s;
          background-color: #ffffff;
        }

        .form-control:focus {
          border-color: #3b82f6;
        }

        .color-picker-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .color-input {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          border: none;
          padding: 0;
          background: none;
        }

        .btn-submit {
          width: 100%;
          background-color: #0f172a;
          color: #ffffff;
          font-weight: 500;
          padding: 10px 0;
          border-radius: 8px;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-submit:hover {
          background-color: #1e293b;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* LIVE PREVIEW HERO */
        .preview-hero-box {
          border-radius: 12px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          min-height: 300px;
          transition: background-color 0.3s;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .preview-hero-box {
            flex-direction: row;
          }
        }

        .preview-image-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .preview-image-wrapper img {
          max-height: 208px;
          width: 100%;
          object-fit: contain;
          filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.2));
        }

        .preview-text-wrapper {
          flex: 1;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .preview-title {
          font-size: 28px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .preview-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin: 0;
          white-space: pre-line;
        }

        .btn-preview {
          background-color: #ffffff;
          color: #0f172a;
          padding: 8px 32px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
      `}</style>

      {/* Header Halaman */}
      <div className="header-section">
        <h1>Kelola Hero Section</h1>
        <p>
          Ubah teks, gambar, dan warna background banner utama secara real-time.
        </p>
      </div>

      {/* Layout 2 Kolom */}
      <div className="grid-layout">
        {/* FORM EDIT */}
        <form onSubmit={handleSave} className="card-box">
          <div className="card-title-container">
            <h2 className="card-title">Form Edit Hero</h2>
          </div>

          <div className="form-group">
            <label>Judul Merek / Product Title</label>
            <input
              type="text"
              className="form-control"
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Deskripsi Singkat</label>
            <textarea
              rows={3}
              className="form-control"
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Teks Tombol</label>
            <input
              type="text"
              className="form-control"
              value={hero.buttonText}
              onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
            />
          </div>

          {/* PILIHAN GAMBAR DARI DATABASE */}
          <div className="form-group">
            <label>Pilih Gambar dari Produk Database</label>
            <select
              className="form-control"
              value={hero.imageUrl}
              onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
            >
              <option value="/ortus.png">Default (Bawaan)</option>
              {listProduk.map((item) => (
                <option
                  key={item.id}
                  value={`http://localhost/api/uploads/${item.image}`}
                >
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Warna Background</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                className="color-input"
                value={hero.bgColor}
                onChange={(e) => setHero({ ...hero, bgColor: e.target.value })}
              />
              <input
                type="text"
                className="form-control"
                style={{ textTransform: "uppercase" }}
                value={hero.bgColor}
                onChange={(e) => setHero({ ...hero, bgColor: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        {/* LIVE PREVIEW */}
        <div className="card-box">
          <div className="card-title-container">
            <h2 className="card-title">Tampilan Real-Time</h2>
            <span className="live-badge">Live Preview</span>
          </div>

          <div
            className="preview-hero-box"
            style={{ backgroundColor: hero.bgColor }}
          >
            <div className="preview-image-wrapper">
              {/* Pengecekan aman agar tidak error jika image empty string */}
              {hero.imageUrl ? (
                <img src={hero.imageUrl} alt="Sepatu" />
              ) : (
                <div style={{ color: "#ffffff", fontSize: "12px" }}>
                  Gambar belum dipilih
                </div>
              )}
            </div>

            <div className="preview-text-wrapper">
              <h1 className="preview-title">{hero.title || "TITLE"}</h1>
              <p className="preview-desc">
                {hero.description || "Deskripsi produk..."}
              </p>
              <div>
                <button className="btn-preview" type="button">
                  {hero.buttonText || "Tombol"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
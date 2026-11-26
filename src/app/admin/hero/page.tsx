"use client";
import React, { useState, useEffect } from "react";

interface HeroData {
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
}

interface Produk {
  id: number | string;
  nama: string;
  image: string;
}

const DEFAULT_HERO: HeroData = {
  title: "APEX ENTHUSIAST STORE",
  description: "Koleksi Eksklusif Sepatu & Apparel Terbaik di Indonesia",
  buttonText: "Jelajahi Produk",
  imageUrl:
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=60",
  bgColor: "#18181b",
  textColor: "#ffffff",
  buttonBgColor: "#ffffff",
  buttonTextColor: "#000000",
};

const PRESETS: { label: string; values: Partial<HeroData> }[] = [
  {
    label: "Dark Minimal",
    values: {
      bgColor: "#18181b",
      textColor: "#ffffff",
      buttonBgColor: "#ffffff",
      buttonTextColor: "#09090b",
    },
  },
  {
    label: "Blue Sport",
    values: {
      bgColor: "#1e3a8a",
      textColor: "#ffffff",
      buttonBgColor: "#eff6ff",
      buttonTextColor: "#1e3a8a",
    },
  },
  {
    label: "Clean Light",
    values: {
      bgColor: "#f4f4f5",
      textColor: "#09090b",
      buttonBgColor: "#09090b",
      buttonTextColor: "#ffffff",
    },
  },
];

function buildImageUrl(rawImg?: string): string {
  const img = (rawImg || "").trim();
  if (!img) return DEFAULT_HERO.imageUrl;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  const cleanPath = img.replace(/^\/?api\/uploads\//, "").replace(/^uploads\//, "");
  return `http://localhost/api/uploads/${cleanPath}`;
}

export default function AdminHeroPage() {
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [listProduk, setListProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: "ok" | "warn" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    const localSaved = localStorage.getItem("apex_hero_config");
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (parsed && typeof parsed === "object") {
          setHero((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // Abaikan jika JSON lokal rusak
      }
    }

    fetch("http://localhost/api/get_hero.php", { cache: "no-store" })
      .then((res) => res.text())
      .then((text) => {
        if (!text.startsWith("<")) {
          const data = JSON.parse(text);
          if (data && data.title) {
            const merged = { ...DEFAULT_HERO, ...data };
            setHero(merged);
            localStorage.setItem("apex_hero_config", JSON.stringify(merged));
          }
        }
      })
      .catch((err) => console.error(err));

    fetch("http://localhost/api/get_produk.php", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListProduk(data);
        } else if (Array.isArray(data?.data)) {
          setListProduk(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusBanner(null);

    localStorage.setItem("apex_hero_config", JSON.stringify(hero));

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
          setStatusBanner({
            type: "ok",
            text: "Hero section tersimpan dan siap tampil di halaman utama.",
          });
        } else {
          setStatusBanner({
            type: "err",
            text: result.message || "Gagal memperbarui data hero.",
          });
        }
      } else {
        setStatusBanner({
          type: "warn",
          text: "Respon server tidak valid, perubahan disimpan di cache lokal browser.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatusBanner({
        type: "warn",
        text: "Server PHP belum terjangkau; perubahan tetap tersimpan di lokal browser.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHero(DEFAULT_HERO);
    localStorage.setItem("apex_hero_config", JSON.stringify(DEFAULT_HERO));
    setStatusBanner({
      type: "ok",
      text: "Pengaturan dikembalikan ke bawaan (klik Simpan Perubahan untuk update ke server).",
    });
  };

  return (
    <div className="admin-hero-container">
      <style jsx>{`
        .admin-hero-container {
          padding: 28px 32px;
          max-width: 1220px;
          margin: 0 0 0 250px;
          font-family: system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
          color: #0f172a;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }
        .header-section h1 {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }
        .header-section p {
          font-size: 13.5px;
          color: #64748b;
          margin: 0;
        }
        .btn-reset {
          background-color: #ffffff;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .btn-reset:hover {
          background-color: #f8fafc;
          color: #0f172a;
        }
        .alert-box {
          padding: 11px 15px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 18px;
          border: 1px solid transparent;
        }
        .alert-ok {
          background-color: #ecfdf5;
          color: #065f46;
          border-color: #a7f3d0;
        }
        .alert-warn {
          background-color: #fffbeb;
          color: #92400e;
          border-color: #fde68a;
        }
        .alert-err {
          background-color: #fef2f2;
          color: #991b1b;
          border-color: #fecaca;
        }
        .grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
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
          padding: 22px;
          border-radius: 14px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
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
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .live-badge {
          font-size: 10.5px;
          background-color: #dcfce7;
          color: #15803d;
          padding: 3px 9px;
          border-radius: 9999px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .preset-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .preset-chip {
          font-size: 11.5px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 7px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          color: #334155;
          cursor: pointer;
        }
        .preset-chip:hover {
          border-color: #2563eb;
          color: #2563eb;
          background-color: #eff6ff;
        }
        .form-group {
          margin-bottom: 14px;
        }
        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 5px;
        }
        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 13.5px;
          box-sizing: border-box;
          outline: none;
          background-color: #ffffff;
          color: #0f172a;
        }
        .form-control:focus {
          border-color: #2563eb;
        }
        .color-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .color-picker-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .color-input {
          width: 36px;
          height: 36px;
          border-radius: 7px;
          cursor: pointer;
          border: 1px solid #cbd5e1;
          padding: 2px;
          background: #ffffff;
        }
        .btn-submit {
          width: 100%;
          background-color: #0f172a;
          color: #ffffff;
          font-weight: 600;
          padding: 10px 0;
          border-radius: 8px;
          font-size: 14px;
          border: none;
          cursor: pointer;
          margin-top: 6px;
        }
        .btn-submit:hover:not(:disabled) {
          background-color: #1e293b;
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .preview-hero-box {
          border-radius: 12px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 290px;
          box-sizing: border-box;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
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
          z-index: 2;
        }
        .preview-image-wrapper img {
          max-height: 190px;
          width: 100%;
          object-fit: contain;
          border-radius: 8px;
        }
        .preview-text-wrapper {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          z-index: 2;
        }
        .preview-title {
          font-size: 24px;
          font-weight: 900;
          text-transform: uppercase;
          margin: 0;
          line-height: 1.15;
        }
        .preview-desc {
          font-size: 12.5px;
          line-height: 1.55;
          margin: 0;
        }
        .btn-preview {
          padding: 8px 22px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 12.5px;
          border: none;
          cursor: pointer;
          margin-top: 4px;
        }
      `}</style>

      <div className="header-section">
        <div>
          <h1>Kelola Hero Section</h1>
          <p>Atur banner utama landing page dan sinkronkan langsung dengan server.</p>
        </div>
        <button type="button" className="btn-reset" onClick={handleReset}>
          Reset Default
        </button>
      </div>

      {statusBanner && (
        <div className={`alert-box alert-${statusBanner.type}`}>
          {statusBanner.text}
        </div>
      )}

      <div className="grid-layout">
        <form onSubmit={handleSave} className="card-box">
          <div className="card-title-container">
            <h2 className="card-title">Form Edit Hero</h2>
          </div>

          <div className="preset-row">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="preset-chip"
                onClick={() => setHero((prev) => ({ ...prev, ...preset.values }))}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Judul Banner</label>
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

          <div className="form-group">
            <label>Pilih Gambar dari Produk Database</label>
            <select
              className="form-control"
              value={hero.imageUrl}
              onChange={(e) => setHero({ ...hero, imageUrl: e.target.value })}
            >
              <option value={DEFAULT_HERO.imageUrl}>Default (Bawaan)</option>
              {listProduk.map((item) => (
                <option key={item.id} value={buildImageUrl(item.image)}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="color-grid">
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
                  value={hero.bgColor}
                  onChange={(e) => setHero({ ...hero, bgColor: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Warna Teks</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  className="color-input"
                  value={hero.textColor}
                  onChange={(e) => setHero({ ...hero, textColor: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control"
                  value={hero.textColor}
                  onChange={(e) => setHero({ ...hero, textColor: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Warna Tombol</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  className="color-input"
                  value={hero.buttonBgColor}
                  onChange={(e) => setHero({ ...hero, buttonBgColor: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control"
                  value={hero.buttonBgColor}
                  onChange={(e) => setHero({ ...hero, buttonBgColor: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Warna Teks Tombol</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  className="color-input"
                  value={hero.buttonTextColor}
                  onChange={(e) => setHero({ ...hero, buttonTextColor: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control"
                  value={hero.buttonTextColor}
                  onChange={(e) => setHero({ ...hero, buttonTextColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

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
              {hero.imageUrl && <img src={hero.imageUrl} alt={hero.title} />}
            </div>

            <div className="preview-text-wrapper">
              <h1 className="preview-title" style={{ color: hero.textColor }}>
                {hero.title || "TITLE"}
              </h1>
              <p className="preview-desc" style={{ color: hero.textColor }}>
                {hero.description || "Deskripsi produk..."}
              </p>
              <div>
                <button
                  className="btn-preview"
                  type="button"
                  style={{
                    backgroundColor: hero.buttonBgColor,
                    color: hero.buttonTextColor,
                  }}
                >
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
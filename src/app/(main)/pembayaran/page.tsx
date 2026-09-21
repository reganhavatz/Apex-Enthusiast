"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ProdukType {
  id: number;
  nama: string;
  harga: number;
  ukuran: string;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idProduk = searchParams.get("id");

  const [tabAktif, setTabAktif] = useState<"informasi" | "pembayaran">("informasi");
  const [produk, setProduk] = useState<ProdukType | null>(null);
  const [loading, setLoading] = useState(true);

  const [namaLengkap, setNamaLengkap] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [kota, setKota] = useState("");
  const [note, setNote] = useState("");

  const [pilihanBank, setPilihanBank] = useState<"BNI" | "MANDIRI" | "BRI" | "BCA">("BNI");
  const [sudahKonfirmasiBank, setSudahKonfirmasiBank] = useState(false);
  const [fileBukti, setFileBukti] = useState<File | null>(null);
  const [previewBukti, setPreviewBukti] = useState<string | null>(null);
  const [pembayaranSelesai, setPembayaranSelesai] = useState(false);

  const REKENING_TOKO: Record<string, { noRek: string; atasNama: string }> = {
    BNI: { noRek: "084567899", atasNama: "Apex Enthusiast SHOP" },
    MANDIRI: { noRek: "880123456789", atasNama: "Apex Enthusiast SHOP" },
    BRI: { noRek: "128008456789", atasNama: "Apex Enthusiast SHOP" },
    BCA: { noRek: "01408456789", atasNama: "Apex Enthusiast SHOP" },
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem("user_profile");
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        setNamaLengkap(profileData.namaLengkap || "");
        setWhatsapp(profileData.whatsapp || "");
        setEmail(profileData.email || "");
        setAlamat(profileData.alamat || "");
        setKodePos(profileData.kodePos || "");
        setKota(profileData.kota || "");
      } catch (e) {
        console.error("Gagal memparsing profil:", e);
      }
    }

    if (!idProduk) {
      setLoading(false);
      return;
    }

    async function fetchProdukDetail() {
      try {
        const res = await fetch(`http://localhost/api/get_produk_detail.php?id=${idProduk}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setProduk(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProdukDetail();
  }, [idProduk]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "namaLengkap") setNamaLengkap(value);
    if (field === "whatsapp") setWhatsapp(value);
    if (field === "email") setEmail(value);
    if (field === "alamat") setAlamat(value);
    if (field === "kodePos") setKodePos(value);
    if (field === "kota") setKota(value);

    const updatedProfile = {
      namaLengkap: field === "namaLengkap" ? value : namaLengkap,
      whatsapp: field === "whatsapp" ? value : whatsapp,
      email: field === "email" ? value : email,
      alamat: field === "alamat" ? value : alamat,
      kodePos: field === "kodePos" ? value : kodePos,
      kota: field === "kota" ? value : kota,
    };
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileBukti(file);
      setPreviewBukti(URL.createObjectURL(file));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor Rekening berhasil disalin!");
  };

  const handleSelesaikanPembayaran = async () => {
    setPembayaranSelesai(true);

    const dataPesanan = {
      id: `#APX-${Math.floor(1000 + Math.random() * 9000)}`,
      pelanggan: namaLengkap || "Pelanggan Tanpa Nama",
      whatsapp: whatsapp,
      email: email,
      alamat: `${alamat}, Kota ${kota} (${kodePos})`,
      note: note,
      metode: `Transfer Bank (${pilihanBank})`,
      total: produk ? `Rp ${Number(produk.harga).toLocaleString("id-ID")}` : "Rp 0",
      status: "Diproses",
      tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      namaProduk: produk ? produk.nama : "Produk Pilihan",
      ukuran: produk ? produk.ukuran : "-",
      image: produk?.image ? `http://localhost/api/uploads/${produk.image}` : "",
    };

    const existingOrders = JSON.parse(localStorage.getItem("admin_orders") || "[]");
    localStorage.setItem("admin_orders", JSON.stringify([dataPesanan, ...existingOrders]));

    try {
      await fetch("http://localhost/api/simpan_pesanan.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPesanan),
      });
    } catch (e) {
      console.log("Simpan ke backend lokal opsional dilewati:", e);
    }
  };

  return (
    <>
      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background-color: #f0f5ff;
          font-family: sans-serif;
          color: #1e293b;
          padding: 40px 24px;
          padding-top: 100px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
        }
        .checkout-wrapper {
          max-width: 860px;
          width: 100%;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
          align-items: start;
        }
        .tab-menu {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .tab-btn-info, .tab-btn-bayar {
          border: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 13px;
          height: 44px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.2s;
        }
        .tab-btn-info {
          background-color: ${tabAktif === "informasi" ? "#1d4ed8" : "#ffffff"};
          color: ${tabAktif === "informasi" ? "#ffffff" : "#334155"};
        }
        .tab-btn-bayar {
          background-color: ${tabAktif === "pembayaran" ? "#1d4ed8" : "#ffffff"};
          color: ${tabAktif === "pembayaran" ? "#ffffff" : "#334155"};
        }
        .form-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          box-sizing: border-box;
        }
        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-label {
          font-size: 13px;
          font-weight: bold;
        }
        .input-box, .textarea-box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          box-sizing: border-box;
          width: 100%;
          outline: none;
        }
        .input-box { height: 38px; }
        .textarea-box { resize: none; font-family: sans-serif; }
        .action-btn {
          margin-top: 6px;
          width: 100%;
          background-color: #1d4ed8;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          height: 40px;
          font-weight: bold;
          cursor: pointer;
          font-size: 13px;
        }
        .secondary-btn {
          margin-top: 6px;
          width: 100%;
          background-color: #ffffff;
          color: #0f172a;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          height: 40px;
          font-weight: bold;
          cursor: pointer;
          font-size: 13px;
        }
        .bank-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .bank-option {
          border-radius: 8px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }
        .radio-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .radio-circle.active {
          border-color: #1d4ed8;
          background-color: #1d4ed8;
        }
        .radio-circle.active::after {
          content: "";
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
        }
        .success-box {
          text-align: center;
          padding: 20px 0;
        }
        .success-icon { font-size: 40px; }
        .success-title { margin: 10px 0 4px; font-size: 16px; }
        .success-desc { color: #6b7280; font-size: 13px; }
        .section-sub-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
        }
        .rekening-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          height: 38px;
          margin-top: 4px;
        }
        .rekening-input {
          flex: 1;
          border: none;
          padding: 0 12px;
          font-size: 13px;
          font-weight: bold;
          outline: none;
        }
        .rekening-copy-btn {
          background-color: #f8fafc;
          border: none;
          border-left: 1px solid #e2e8f0;
          padding: 0 14px;
          height: 100%;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
        }
        .upload-title { font-size: 13px; font-weight: bold; }
        .upload-input { margin-top: 6px; font-size: 12px; }
        .preview-image {
          width: 100%;
          max-height: 150px;
          object-fit: contain;
          border-radius: 8px;
          margin-top: 8px;
        }
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .card-section {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          border-top: 5px solid #1d4ed8;
        }
        .card-title {
          font-size: 13px;
          font-weight: bold;
          color: #1e293b;
          margin: 0;
        }
        .product-box {
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .product-img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: 6px;
          background: #f8fafc;
        }
        .product-info-summary {
          flex: 1;
        }
        .product-name {
          font-size: 12px;
          font-weight: bold;
        }
        .product-size {
          font-size: 10px;
          color: #64748b;
        }
        .product-price {
          font-size: 12px;
          font-weight: bold;
        }
        .price-detail-box {
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          color: #334155;
        }
        .price-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: bold;
          margin-top: 4px;
          border-top: 1px solid #f1f5f9;
          padding-top: 6px;
        }
      `}</style>

      <div className="checkout-page">
        <div className="checkout-wrapper">
          <div>
            <div className="tab-menu">
              <button type="button" className="tab-btn-info" onClick={() => setTabAktif("informasi")}>
                Informasi Pembeli
              </button>
              <button type="button" className="tab-btn-bayar" onClick={() => setTabAktif("pembayaran")}>
                Pembayaran
              </button>
            </div>

            <div className="form-card">
              {tabAktif === "informasi" ? (
                <>
                  <div className="input-grid">
                    <div className="input-group">
                      <label className="input-label">Nama Lengkap</label>
                      <input type="text" className="input-box" value={namaLengkap} onChange={(e) => handleInputChange("namaLengkap", e.target.value)} placeholder="Masukkan nama..." />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Nomor Handphone / WhatsApp</label>
                      <input type="text" className="input-box" value={whatsapp} onChange={(e) => handleInputChange("whatsapp", e.target.value)} placeholder="08xxxxxxxxxx" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input type="email" className="input-box" value={email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="email@domain.com" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Alamat Lengkap</label>
                    <input type="text" className="input-box" value={alamat} onChange={(e) => handleInputChange("alamat", e.target.value)} placeholder="Nama jalan, nomor rumah, RT/RW..." />
                  </div>
                  <div className="input-grid">
                    <div className="input-group">
                      <label className="input-label">Kode Pos</label>
                      <input type="text" className="input-box" value={kodePos} onChange={(e) => handleInputChange("kodePos", e.target.value)} placeholder="12345" />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Kota</label>
                      <input type="text" className="input-box" value={kota} onChange={(e) => handleInputChange("kota", e.target.value)} placeholder="Nama Kota" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Catatan (Opsional)</label>
                    <textarea className="textarea-box" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan khusus..." />
                  </div>
                  <button type="button" className="action-btn" onClick={() => setTabAktif("pembayaran")}>
                    Proses ke Pembayaran
                  </button>
                </>
              ) : (
                <>
                  {pembayaranSelesai ? (
                    <div className="success-box">
                      <div className="success-icon">✅</div>
                      <h3 className="success-title">Bukti Transfer Terkirim!</h3>
                      <p className="success-desc">Pesanan Anda berhasil dibuat dan sedang diproses oleh admin.</p>
                    </div>
                  ) : !sudahKonfirmasiBank ? (
                    <>
                      <div className="section-sub-title">Pilih Tujuan Bank Transfer :</div>
                      <div className="bank-list">
                        <div className="bank-option" onClick={() => setPilihanBank("BNI")} style={{ borderColor: pilihanBank === "BNI" ? "#1d4ed8" : "#e2e8f0" }}>
                          <span style={{ fontWeight: "bold", fontSize: "13px", color: "#e05d06" }}>BNI Virtual Account</span>
                          <div className={`radio-circle ${pilihanBank === "BNI" ? "active" : ""}`} />
                        </div>
                        <div className="bank-option" onClick={() => setPilihanBank("MANDIRI")} style={{ borderColor: pilihanBank === "MANDIRI" ? "#1d4ed8" : "#e2e8f0" }}>
                          <span style={{ fontWeight: "bold", fontSize: "13px", color: "#003d79" }}>Mandiri Virtual Account</span>
                          <div className={`radio-circle ${pilihanBank === "MANDIRI" ? "active" : ""}`} />
                        </div>
                        <div className="bank-option" onClick={() => setPilihanBank("BRI")} style={{ borderColor: pilihanBank === "BRI" ? "#1d4ed8" : "#e2e8f0" }}>
                          <span style={{ fontWeight: "bold", fontSize: "13px", color: "#00529c" }}>BRI Virtual Account</span>
                          <div className={`radio-circle ${pilihanBank === "BRI" ? "active" : ""}`} />
                        </div>
                        <div className="bank-option" onClick={() => setPilihanBank("BCA")} style={{ borderColor: pilihanBank === "BCA" ? "#1d4ed8" : "#e2e8f0" }}>
                          <span style={{ fontWeight: "bold", fontSize: "13px", color: "#0066ae" }}>BCA Virtual Account</span>
                          <div className={`radio-circle ${pilihanBank === "BCA" ? "active" : ""}`} />
                        </div>
                      </div>
                      <div className="input-group" style={{ marginTop: "4px" }}>
                        <label className="input-label">Nomor Virtual Akun</label>
                        <div className="rekening-wrapper">
                          <input type="text" className="rekening-input" readOnly value={REKENING_TOKO[pilihanBank].noRek} />
                          <button type="button" className="rekening-copy-btn" onClick={() => copyToClipboard(REKENING_TOKO[pilihanBank].noRek)}>SALIN</button>
                        </div>
                      </div>
                      <div style={{ fontSize: "12px", color: "#334155", marginTop: "2px" }}>
                        Nama Rekening : <strong>{REKENING_TOKO[pilihanBank].atasNama}</strong><br />
                        Total Bayar: <strong>{produk ? `Rp ${Number(produk.harga).toLocaleString("id-ID")}` : "Rp 0"}</strong>
                      </div>
                      <button type="button" className="action-btn" onClick={() => setSudahKonfirmasiBank(true)}>
                        Sudah Transfer & Upload Bukti
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="upload-title">Upload Bukti Transfer ({pilihanBank})</div>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="upload-input" />
                      {previewBukti && <img src={previewBukti} alt="Preview Bukti" className="preview-image" />}
                      <button type="button" className="action-btn" onClick={handleSelesaikanPembayaran}>
                        Kirim Bukti Pembayaran
                      </button>
                      <button type="button" className="secondary-btn" onClick={() => setSudahKonfirmasiBank(false)}>
                        Kembali
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="card-section">
              <h4 className="card-title">Detail Produk</h4>
              <div className="product-box">
                {produk?.image ? (
                  <img src={`http://localhost/api/uploads/${produk.image}`} alt={produk.nama} className="product-img" />
                ) : (
                  <div className="product-img" style={{ background: "#cbd5e1" }} />
                )}
                <div className="product-info-summary">
                  <div className="product-name">{loading ? "Memuat produk..." : produk?.nama || "Produk Pilihan"}</div>
                  <div className="product-size">UKURAN {produk?.ukuran || "-"}</div>
                </div>
                <div className="product-price">
                  {produk ? `Rp ${Number(produk.harga).toLocaleString("id-ID")}` : "Rp 0"}
                </div>
              </div>
            </div>

            <div className="card-section">
              <h4 className="card-title">Detail Harga</h4>
              <div className="price-detail-box">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>{produk ? `Rp ${Number(produk.harga).toLocaleString("id-ID")}` : "Rp 0"}</span>
                </div>
                <div className="price-row">
                  <span>Pengiriman</span>
                  <span>Rp 0</span>
                </div>
                <div className="price-total-row">
                  <span>Total</span>
                  <span>{produk ? `Rp ${Number(produk.harga).toLocaleString("id-ID")}` : "Rp 0"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
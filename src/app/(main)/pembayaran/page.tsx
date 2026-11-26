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

interface ProvinsiItem {
  id?: number | string;
  province_id?: number | string;
  name?: string;
  province?: string;
}

interface KotaItem {
  id?: number | string;
  city_id?: number | string;
  name?: string;
  city_name?: string;
  type?: string;
  postal_code?: string;
}

interface LayananOngkirItem {
  name?: string;
  code?: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idProduk = searchParams.get("id");

  const [tabAktif, setTabAktif] = useState<"informasi" | "pembayaran">("informasi");
  const [produk, setProduk] = useState<ProdukType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  const [namaLengkap, setNamaLengkap] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [kota, setKota] = useState("");
  const [note, setNote] = useState("");

  const [daftarProvinsi, setDaftarProvinsi] = useState<ProvinsiItem[]>([]);
  const [provinsiId, setProvinsiId] = useState("");
  const [daftarKota, setDaftarKota] = useState<KotaItem[]>([]);
  const [kotaTujuanId, setKotaTujuanId] = useState("");
  const [kurir, setKurir] = useState("");
  const [pilihanLayananOngkir, setPilihanLayananOngkir] = useState<LayananOngkirItem[]>([]);
  const [layananIndex, setLayananIndex] = useState("-1");
  const [biayaOngkir, setBiayaOngkir] = useState(0);
  const [infoLayananTerpilih, setInfoLayananTerpilih] = useState("Reguler");
  const [loadingOngkir, setLoadingOngkir] = useState(false);

  const [pilihanBank, setPilihanBank] = useState<"BNI" | "MANDIRI" | "BRI" | "BCA">("BNI");
  const [pembayaranSelesai, setPembayaranSelesai] = useState(false);

  const REKENING_TOKO: Record<string, { label: string; warna: string; noRek: string; atasNama: string }> = {
    BNI: {
      label: "BNI Virtual Account",
      warna: "#e05d06",
      noRek: "084567899",
      atasNama: "Apex Enthusiast SHOP",
    },
    MANDIRI: {
      label: "Mandiri Virtual Account",
      warna: "#003d79",
      noRek: "880123456789",
      atasNama: "Apex Enthusiast SHOP",
    },
    BRI: {
      label: "BRI Virtual Account",
      warna: "#00529c",
      noRek: "128008456789",
      atasNama: "Apex Enthusiast SHOP",
    },
    BCA: {
      label: "BCA Virtual Account",
      warna: "#0066ae",
      noRek: "01408456789",
      atasNama: "Apex Enthusiast SHOP",
    },
  };

  const fetchProvinsi = async () => {
    try {
      const res = await fetch("http://localhost/api/get_provinsi.php");
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      setDaftarProvinsi(list);
    } catch (err) {
      console.error("Gagal memuat provinsi:", err);
    }
  };

  const fetchKotaByProvinsi = async (provId: string) => {
    if (!provId) {
      setDaftarKota([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost/api/get_kota.php?province_id=${provId}`);
      const data = await res.json();
      const list = Array.isArray(data?.data) ? data.data : [];
      setDaftarKota(list);
    } catch (err) {
      console.error("Gagal memuat kota:", err);
    }
  };

  const cekOngkirOtomatis = async (destId: string, selectedCourier: string) => {
    if (!destId || !selectedCourier) {
      setPilihanLayananOngkir([]);
      setLayananIndex("-1");
      setBiayaOngkir(0);
      return;
    }

    setLoadingOngkir(true);
    setLayananIndex("-1");
    setBiayaOngkir(0);

    const beratProdukGram = 1000;

    try {
      const res = await fetch("http://localhost/api/get_ongkir.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destId,
          weight: beratProdukGram,
          courier: selectedCourier,
        }),
      });

      const data = await res.json();
      const layananList = Array.isArray(data?.data) ? data.data : [];
      setPilihanLayananOngkir(layananList);
    } catch (err) {
      console.error("Gagal menghitung ongkir:", err);
      setPilihanLayananOngkir([]);
    } finally {
      setLoadingOngkir(false);
    }
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

    fetchProvinsi();

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

          if (data && data.image && !data.image.startsWith("http")) {
            data.image = `http://localhost/api/uploads/${data.image}`;
          }

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
    if (errorInfo) setErrorInfo("");
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

  const handleLanjutPembayaran = () => {
    if (!namaLengkap.trim()) {
      setErrorInfo("Nama lengkap wajib diisi.");
      return;
    }
    if (!whatsapp.trim()) {
      setErrorInfo("Nomor handphone / WhatsApp wajib diisi.");
      return;
    }
    if (!email.trim()) {
      setErrorInfo("Email wajib diisi.");
      return;
    }
    if (!alamat.trim()) {
      setErrorInfo("Alamat lengkap wajib diisi.");
      return;
    }
    if (!provinsiId) {
      setErrorInfo("Provinsi wajib dipilih.");
      return;
    }
    if (!kotaTujuanId) {
      setErrorInfo("Kota tujuan pengiriman wajib dipilih.");
      return;
    }
    if (!kodePos.trim()) {
      setErrorInfo("Kode pos wajib diisi.");
      return;
    }
    if (!kurir) {
      setErrorInfo("Kurir wajib dipilih.");
      return;
    }
    if (layananIndex === "-1" || !pilihanLayananOngkir[Number(layananIndex)]) {
      setErrorInfo("Layanan & ongkir wajib dipilih.");
      return;
    }

    setErrorInfo("");
    setTabAktif("pembayaran");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor Rekening berhasil disalin!");
  };

  const handleSelesaikanPesanan = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const hargaProdukNum = produk ? Number(produk.harga) : 0;
    const totalHargaNum = hargaProdukNum + Number(biayaOngkir);
    const formattedTotal = `Rp ${Number(totalHargaNum).toLocaleString("id-ID")}`;
    const tanggalHariIni = new Date().toISOString().split("T")[0];

    const imageUrl = produk?.image
      ? produk.image.startsWith("http")
        ? produk.image
        : `http://localhost/api/uploads/${produk.image}`
      : "";

    const pesananBaru = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      pelanggan: namaLengkap || "Pelanggan Tanpa Nama",
      whatsapp: whatsapp || "-",
      email: email || "-",
      alamat: `${alamat || "-"}, Kota ${kota || "-"} (${kodePos || "-"}) | Catatan: ${note || "-"}`,
      metode: `Transfer Bank (${pilihanBank})`,
      subtotalNum: hargaProdukNum,
      total: formattedTotal,
      totalNum: totalHargaNum,
      ongkirNum: Number(biayaOngkir),
      status: "Pesanan Baru",
      kurir: `${kurir.toUpperCase()} - ${infoLayananTerpilih} (Ongkir: Rp ${Number(biayaOngkir).toLocaleString("id-ID")})`,
      tanggal: tanggalHariIni,
      namaProduk: produk?.nama || "Produk Pilihan",
      image: imageUrl,
      ukuran: produk?.ukuran || "-",
      buktiTransfer: null,
      sudahDikonfirmasiAdmin: false,
    };

    try {
      const existingData = JSON.parse(localStorage.getItem("orders") || "[]");
      const listAman = existingData.slice(0, 10);

      const dataBaru = [pesananBaru, ...listAman];
      const stringData = JSON.stringify(dataBaru);

      localStorage.setItem("orders", stringData);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Gagal menyimpan pesanan:", err);
      alert("Penyimpanan lokal penuh!");
    }

    setIsSubmitting(false);
    setPembayaranSelesai(true);
  };

  const subtotalNum = produk ? Number(produk.harga) : 0;
  const grandTotalNum = subtotalNum + Number(biayaOngkir);
  const daftarBank: Array<"BNI" | "MANDIRI" | "BRI" | "BCA"> = ["BNI", "MANDIRI", "BRI", "BCA"];

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
          margin-top:-60px;
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

        .tab-btn-info,
        .tab-btn-bayar {
          border: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 13px;
          height: 44px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
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

        .error-text {
          margin: 0;
          color: #dc2626;
          font-size: 12px;
          font-weight: 600;
        }

        .input-box,
        .textarea-box {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          box-sizing: border-box;
          width: 100%;
          outline: none;
          background-color: #ffffff;
          color: #1e293b;
        }

        .input-box {
          height: 38px;
        }

        .textarea-box {
          resize: none;
          font-family: sans-serif;
        }

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
          transition: border-color 0.2s, background-color 0.2s;
        }

        .bank-option.selected {
          border-color: #1d4ed8;
          background-color: #eff6ff;
        }

        .radio-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .radio-circle.active {
          border-color: #1d4ed8;
          background-color: #1d4ed8;
        }

        .radio-circle.active::after {
          content: "";
          width: 6px;
          height: 6px;
          background: #ffffff;
          border-radius: 50%;
        }

        .rekening-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          height: 38px;
          margin-top: 4px;
          background: #ffffff;
        }

        .rekening-input {
          flex: 1;
          border: none;
          padding: 0 12px;
          font-size: 13px;
          font-weight: bold;
          color: #0f172a;
          outline: none;
          background: transparent;
        }

        .rekening-copy-btn {
          background-color: #f8fafc;
          color: #1e293b;
          border: none;
          border-left: 1px solid #e2e8f0;
          padding: 0 14px;
          height: 100%;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
        }

        .rekening-copy-btn:hover {
          background-color: #eff6ff;
          color: #1d4ed8;
        }

        .success-box {
          text-align: center;
          padding: 20px 0;
        }

        .success-icon {
          font-size: 40px;
        }

        .success-title {
          margin: 10px 0 4px;
          font-size: 16px;
        }

        .success-desc {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.5;
        }

        .section-sub-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
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
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
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
              <button
                type="button"
                className="tab-btn-info"
                onClick={() => setTabAktif("informasi")}
              >
                Informasi Pembeli
              </button>

              <button
                type="button"
                className="tab-btn-bayar"
                onClick={handleLanjutPembayaran}
              >
                Pembayaran
              </button>
            </div>

            <div className="form-card">
              {tabAktif === "informasi" ? (
                <>
                  <div className="input-grid">
                    <div className="input-group">
                      <label className="input-label">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        className="input-box"
                        value={namaLengkap}
                        onChange={(e) =>
                          handleInputChange("namaLengkap", e.target.value)
                        }
                        placeholder="Masukkan nama..."
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        Nomor Handphone / WhatsApp
                      </label>
                      <input
                        type="text"
                        required
                        className="input-box"
                        value={whatsapp}
                        onChange={(e) =>
                          handleInputChange("whatsapp", e.target.value)
                        }
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email </label>
                    <input
                      type="email"
                      required
                      className="input-box"
                      value={email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="email@domain.com"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Alamat Lengkap </label>
                    <input
                      type="text"
                      required
                      className="input-box"
                      value={alamat}
                      onChange={(e) =>
                        handleInputChange("alamat", e.target.value)
                      }
                      placeholder="Nama jalan, nomor rumah, RT/RW..."
                    />
                  </div>

                  <div className="input-grid">
                    <div className="input-group">
                      <label className="input-label">Provinsi </label>
                      <select
                        required
                        className="input-box"
                        value={provinsiId}
                        onChange={(e) => {
                          if (errorInfo) setErrorInfo("");
                          const idProv = e.target.value;
                          setProvinsiId(idProv);
                          setKotaTujuanId("");
                          setPilihanLayananOngkir([]);
                          setLayananIndex("-1");
                          setBiayaOngkir(0);
                          fetchKotaByProvinsi(idProv);
                        }}
                      >
                        <option value=""> Pilih Provinsi </option>

                        {daftarProvinsi.map((p, idx) => {
                          const idVal = String(p.id ?? p.province_id ?? idx);
                          const labelProv = p.name ?? p.province ?? "Provinsi";

                          return (
                            <option key={idVal} value={idVal}>
                              {labelProv}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        Kota Tujuan Pengiriman 
                      </label>

                      <select
                        required
                        className="input-box"
                        value={kotaTujuanId}
                        disabled={!provinsiId}
                        onChange={(e) => {
                          if (errorInfo) setErrorInfo("");
                          const idDipilih = e.target.value;
                          setKotaTujuanId(idDipilih);

                          const kotaObj = daftarKota.find(
                            (k) =>
                              String(k.id ?? k.city_id) === String(idDipilih)
                          );

                          const namaKotaDipilih = kotaObj
                            ? `${kotaObj.type ? kotaObj.type + " " : ""}${kotaObj.name ?? kotaObj.city_name ?? ""}`
                            : "";

                          handleInputChange("kota", namaKotaDipilih);
                          cekOngkirOtomatis(idDipilih, kurir);
                        }}
                      >
                        <option value="">
                          {provinsiId
                            ? "Pilih Kota Tujuan "
                            : "Pilih provinsi dulu"}
                        </option>

                        {daftarKota.map((k, idx) => {
                          const idVal = String(k.id ?? k.city_id ?? idx);
                          const labelKota = `${k.type ? k.type + " " : ""}${k.name ?? k.city_name ?? "Kota"}`;

                          return (
                            <option key={idVal} value={idVal}>
                              {labelKota}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="input-grid">
                    <div className="input-group">
                      <label className="input-label">Kode Pos </label>
                      <input
                        type="text"
                        required
                        className="input-box"
                        value={kodePos}
                        onChange={(e) =>
                          handleInputChange("kodePos", e.target.value)
                        }
                        placeholder="12345"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Kurir </label>
                      <select
                        required
                        className="input-box"
                        value={kurir}
                        onChange={(e) => {
                          if (errorInfo) setErrorInfo("");
                          const kurirBaru = e.target.value;
                          setKurir(kurirBaru);

                          if (kotaTujuanId && kurirBaru) {
                            cekOngkirOtomatis(kotaTujuanId, kurirBaru);
                          } else {
                            setPilihanLayananOngkir([]);
                            setLayananIndex("-1");
                            setBiayaOngkir(0);
                          }
                        }}
                      >
                        <option value=""> Pilih Kurir </option>
                        <option value="jne">JNE</option>
                        <option value="jnt">J&amp;T</option>
                        <option value="sicepat">SiCepat</option>
                        <option value="pos">POS</option>
                        <option value="tiki">TIKI</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Layanan &amp; Ongkir *</label>

                    <select
                      required
                      className="input-box"
                      value={layananIndex}
                      disabled={
                        loadingOngkir || pilihanLayananOngkir.length === 0
                      }
                      onChange={(e) => {
                        if (errorInfo) setErrorInfo("");
                        const valStr = e.target.value;
                        setLayananIndex(valStr);
                        const idx = Number(valStr);

                        if (
                          isNaN(idx) ||
                          idx < 0 ||
                          !pilihanLayananOngkir[idx]
                        ) {
                          setBiayaOngkir(0);
                          setInfoLayananTerpilih("Reguler");
                          return;
                        }

                        const item = pilihanLayananOngkir[idx];
                        setBiayaOngkir(Number(item.cost) || 0);
                        setInfoLayananTerpilih(item.service || "Reguler");
                      }}
                    >
                      <option value="-1">
                        {loadingOngkir
                          ? "Menghitung ongkir..."
                          : pilihanLayananOngkir.length > 0
                          ? "-- Pilih Layanan Ongkir --"
                          : "Pilih kota & kurir dulu"}
                      </option>

                      {pilihanLayananOngkir.map((item, idx) => (
                        <option key={idx} value={idx}>
                          {item.service} - Rp{" "}
                          {Number(item.cost).toLocaleString("id-ID")} (
                          {item.etd} hari)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Catatan (Opsional)</label>
                    <textarea
                      className="textarea-box"
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Catatan khusus..."
                    />
                  </div>

                  {errorInfo && <p className="error-text">{errorInfo}</p>}

                  <button
                    type="button"
                    className="action-btn"
                    onClick={handleLanjutPembayaran}
                  >
                    Proses ke Pembayaran
                  </button>
                </>
              ) : (
                <>
                  {pembayaranSelesai ? (
                    <div className="success-box">
                      <div className="success-icon">✅</div>

                      <h3 className="success-title">
                        Pesanan Berhasil Dibuat!
                      </h3>

                      <p className="success-desc">
                        Pesanan Anda berhasil dikirim ke admin. Silakan tunggu
                        konfirmasi awal dari admin sebelum mengunggah bukti
                        transfer.
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "16px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => router.push("/profil/riwayat")}
                        >
                          Lihat Riwayat Pesanan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="section-sub-title">
                        Pilih Tujuan Bank Transfer :
                      </div>

                      <div className="bank-list">
                        {daftarBank.map((kodeBank) => {
                          const infoBank = REKENING_TOKO[kodeBank];
                          const terpilih = pilihanBank === kodeBank;
                          return (
                            <div
                              key={kodeBank}
                              className={`bank-option ${terpilih ? "selected" : ""}`}
                              onClick={() => setPilihanBank(kodeBank)}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  color: infoBank.warna,
                                }}
                              >
                                {infoBank.label}
                              </span>
                              <div
                                className={`radio-circle ${terpilih ? "active" : ""}`}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="input-group" style={{ marginTop: "4px" }}>
                        <label className="input-label">Nomor Virtual Akun</label>

                        <div className="rekening-wrapper">
                          <input
                            type="text"
                            className="rekening-input"
                            readOnly
                            value={REKENING_TOKO[pilihanBank].noRek}
                          />

                          <button
                            type="button"
                            className="rekening-copy-btn"
                            onClick={() =>
                              copyToClipboard(REKENING_TOKO[pilihanBank].noRek)
                            }
                          >
                            SALIN
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#334155",
                          marginTop: "2px",
                          lineHeight: 1.6,
                        }}
                      >
                        Nama Rekening :{" "}
                        <strong>{REKENING_TOKO[pilihanBank].atasNama}</strong>
                        <br />
                        Ongkir ({kurir.toUpperCase()} - {infoLayananTerpilih}):{" "}
                        <strong>
                          Rp {Number(biayaOngkir).toLocaleString("id-ID")}
                        </strong>
                        <br />
                        Total Bayar:{" "}
                        <strong>
                          {produk
                            ? `Rp ${Number(grandTotalNum).toLocaleString("id-ID")}`
                            : "Rp 0"}
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="action-btn"
                        disabled={isSubmitting}
                        onClick={handleSelesaikanPesanan}
                      >
                        {isSubmitting
                          ? "Memproses..."
                          : "Buat Pesanan & Bayar Nanti"}
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
                  <img
                    src={produk.image}
                    alt={produk.nama}
                    className="product-img"
                  />
                ) : (
                  <div
                    className="product-img"
                    style={{ background: "#cbd5e1" }}
                  />
                )}

                <div className="product-info-summary">
                  <div className="product-name">
                    {loading
                      ? "Memuat produk..."
                      : produk?.nama || "Produk Pilihan"}
                  </div>

                  <div className="product-size">
                    UKURAN {produk?.ukuran || "-"}
                  </div>
                </div>

                <div className="product-price">
                  {produk
                    ? `Rp ${Number(produk.harga).toLocaleString("id-ID")}`
                    : "Rp 0"}
                </div>
              </div>
            </div>

            <div className="card-section">
              <h4 className="card-title">Detail Harga</h4>

              <div className="price-detail-box">
                <div className="price-row">
                  <span>Subtotal</span>

                  <span>
                    {produk
                      ? `Rp ${subtotalNum.toLocaleString("id-ID")}`
                      : "Rp 0"}
                  </span>
                </div>

                <div className="price-row">
                  <span>Pengiriman</span>

                  <span>
                    Rp {Number(biayaOngkir).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="price-total-row">
                  <span>Total</span>

                  <span>
                    {produk
                      ? `Rp ${grandTotalNum.toLocaleString("id-ID")}`
                      : "Rp 0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
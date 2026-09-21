"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

interface FormData {
  nama: string;
  deskripsi: string;
  stok: string;
  harga: string;
  jenis: string;
  kategori: string;
  ukuran: string;
  image: File | null;
  imageLama?: string;
}

export default function EditProduk() {
  const params = useParams();
  const router = useRouter();
  const idProduk = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    deskripsi: "",
    stok: "",
    harga: "",
    jenis: "",
    kategori: "",
    ukuran: "",
    image: null,
    imageLama: "",
  });

  // 1. Ambil data produk lama saat halaman pertama kali dibuka
  useEffect(() => {
    if (!idProduk) return;

    async function ambilDetailProduk() {
      try {
        const res = await fetch(`http://localhost/api/get_produk_detail.php?id=${idProduk}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data) {
          setFormData({
            nama: data.nama || "",
            deskripsi: data.deskripsi || "",
            stok: data.stok || "",
            harga: data.harga || "",
            jenis: data.jenis || "",
            kategori: data.kategori || "",
            ukuran: data.ukuran || "",
            image: null,
            imageLama: data.image || "",
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    }

    ambilDetailProduk();
  }, [idProduk]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // 2. Kirim data yang diubah ke backend PHP menggunakan FormData
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const dataToSend = new FormData();
    dataToSend.append("id", String(idProduk));
    dataToSend.append("nama", formData.nama);
    dataToSend.append("deskripsi", formData.deskripsi);
    dataToSend.append("stok", formData.stok);
    dataToSend.append("harga", formData.harga);
    dataToSend.append("jenis", formData.jenis);
    dataToSend.append("kategori", formData.kategori);
    dataToSend.append("ukuran", formData.ukuran);

    if (formData.image) {
      dataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost/api/edit_produk.php", {
        method: "POST",
        body: dataToSend,
      });

      const responseText = await response.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (err) {
        console.error("Respons PHP bukan JSON:", responseText);
        alert(`Error dari PHP: ${responseText}`);
        return;
      }

      if (result && result.status === "success") {
        alert("Produk berhasil diperbarui!");
        router.push("/admin/produk");
      } else {
        alert(`Gagal memperbarui produk: ${result?.message || 'Kesalahan tidak diketahui'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>Memuat data produk...</div>;
  }

  return (
    <>
      <style jsx>{`
        .page-container {
          display: flex;
          min-height: 100vh;
          background-color: #eff6ff;
          font-family: Arial, sans-serif;
        }

        .main-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 20px;
        }

        .form-card {
          background-color: #ffffff;
          width: 100%;
          max-width: 550px;
          border-radius: 12px;
          padding: 32px 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .form-title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          color: #000000;
          margin-bottom: 28px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;
          font-size: 11px;
          font-weight: bold;
          color: #000000;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          background-color: #ffffff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #0080ff;
          box-shadow: 0 0 0 2px rgba(0, 128, 255, 0.15);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231d4ed8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 14px top 50%;
          background-size: 10px auto;
          cursor: pointer;
        }

        .image-upload-box {
          border: 1px solid #94a3b8;
          border-radius: 4px;
          height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          margin-top: 24px;
          margin-bottom: 24px;
          position: relative;
          background-color: #ffffff;
          overflow: hidden;
        }

        .image-upload-box input[type="file"] {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }

        .upload-text {
          font-size: 11px;
          font-weight: bold;
          color: #000000;
          margin-bottom: 4px;
          text-align: center;
          padding: 0 10px;
        }

        .upload-icon {
          font-size: 24px;
          font-weight: bold;
          color: #000000;
        }

        .btn-submit {
          width: 100%;
          background-color: #1642d7;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-submit:hover {
          background-color: #0d32b5;
        }
      `}</style>

      <div className="page-container">
        <div className="main-content">
          <div className="form-card">
            <h1 className="form-title">Edit Produk</h1>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nama Produk</label>
                <input
                  type="text"
                  name="nama"
                  className="form-input"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <input
                  type="text"
                  name="deskripsi"
                  className="form-input"
                  value={formData.deskripsi}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stok</label>
                <input
                  type="number"
                  name="stok"
                  className="form-input"
                  value={formData.stok}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Harga</label>
                <input
                  type="number"
                  name="harga"
                  className="form-input"
                  value={formData.harga}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ukuran</label>
                <input
                  type="text"
                  name="ukuran"
                  className="form-input"
                  value={formData.ukuran}
                  onChange={handleChange}
                />
              </div>

              {/* Pilihan Jenis */}
              <div className="form-group">
                <label className="form-label">Jenis</label>
                <select
                  name="jenis"
                  className="form-select"
                  value={formData.jenis}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Jenis</option>
                  <option value="PRIA">PRIA</option>
                  <option value="WANITA">WANITA</option>
                  <option value="ANAK">ANAK</option>
                </select>
              </div>

              {/* Pilihan Kategori */}
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select
                  name="kategori"
                  className="form-select"
                  value={formData.kategori}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="SEPAK BOLA">SEPAK BOLA</option>
                  <option value="FUTSAL">FUTSAL</option>
                  <option value="SEPATU LARI">SEPATU LARI</option>
                </select>
              </div>

              <div className="image-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <span className="upload-text">
                  {formData.image 
                    ? `Baru: ${formData.image.name}` 
                    : formData.imageLama 
                    ? `File saat ini: ${formData.imageLama}` 
                    : "Pilih Gambar"}
                </span>
                <span className="upload-icon">+</span>
              </div>

              <button type="submit" className="btn-submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
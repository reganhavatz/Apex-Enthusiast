"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function TambahProduk() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: "",
    brand: "",
    deskripsi: "",
    stok: "",
    harga: "",
    kategori: "Sepak Bola",
    ukuran: "",
  });

  const [kategoriBaru, setKategoriBaru] = useState("");
  const [images, setImages] = useState<(File | null)[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSingleImageChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = file;
        return newImages;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nama", formData.nama);
    data.append("brand", formData.brand);
    data.append("deskripsi", formData.deskripsi);
    data.append("stok", formData.stok);
    data.append("harga", formData.harga);

    const kategoriDipilih =
      kategoriBaru.trim() !== ""
        ? kategoriBaru.trim()
        : formData.kategori;

    data.append("kategori", kategoriDipilih);
    data.append("ukuran", formData.ukuran);

    // Pastikan hanya file yang ada isinya yang di-append ke FormData
    images.forEach((file) => {
      if (file) {
        data.append("image[]", file);
      }
    });

    try {
      const res = await fetch("http://localhost/api/tambah_produk.php", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.status === "success") {
        alert("Produk dan galeri gambar berhasil ditambahkan!");
        router.push("/admin/produk");
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi ke server backend.");
    }
  };

  return (
    <>
      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: #f5f7fb;
          font-family: "Poppins", sans-serif;
          padding: 30px 35px 50px;
          margin-left: 270px;
          box-sizing: border-box;
          color: #1e293b;
        }
        .page-header {
          margin-bottom: 25px;
        }
        .page-title {
          font-size: 25px;
          font-weight: 750;
          color: #172b4d;
          margin: 0 0 7px;
          letter-spacing: -0.5px;
        }
        .page-description {
          font-size: 13px;
          color: #8998ae;
          margin: 0;
          line-height: 1.6;
        }
        .form-card {
          background: #ffffff;
          border: 1px solid #edf0f5;
          border-radius: 16px;
          padding: 30px;
          width: 100%;
          max-width: 1100px;
          box-sizing: border-box;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.035);
        }
        .section-header {
          margin-bottom: 23px;
          padding-bottom: 17px;
          border-bottom: 1px solid #edf0f5;
        }
        .section-title {
          font-size: 16px;
          font-weight: 750;
          color: #1e293b;
          margin: 0 0 5px;
        }
        .section-description {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-group {
          margin-bottom: 19px;
          min-width: 0;
        }
        .form-group.full {
          grid-column: 1 / -1;
        }
        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 650;
          color: #34445b;
          margin-bottom: 9px;
        }
        .required {
          color: #ef4444;
          margin-left: 3px;
        }
        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
          background: #ffffff;
          color: #334155;
          font-family: inherit;
          transition: 0.2s ease;
        }
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.09);
        }
        .form-select {
          cursor: pointer;
        }
        .form-textarea {
          min-height: 125px;
          resize: vertical;
          line-height: 1.7;
        }
        .input-hint {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 7px;
        }
        .upload-section {
          margin-top: 10px;
          padding-top: 25px;
          border-top: 1px solid #edf0f5;
        }
        .upload-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-top: 20px;
        }
        .upload-box {
          min-width: 0;
          border: 1px dashed #cbd5e1;
          background: #f8fafc;
          border-radius: 11px;
          padding: 15px 10px;
          min-height: 145px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: 0.2s ease;
        }
        .upload-box:hover {
          border-color: #2563eb;
          background: #f5f8ff;
        }
        .upload-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #eaf1ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 10px;
        }
        .upload-title {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 5px;
        }
        .upload-desc {
          font-size: 10px;
          color: #94a3b8;
          margin-bottom: 12px;
        }
        .upload-input {
          display: none;
        }
        .upload-action {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 160px;
          min-height: 32px;
          padding: 7px 9px;
          box-sizing: border-box;
          background: #ffffff;
          border: 1px solid #dbe3ef;
          border-radius: 6px;
          color: #2563eb;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          overflow-wrap: anywhere;
          transition: 0.2s ease;
        }
        .upload-action:hover {
          background: #eff6ff;
          border-color: #2563eb;
        }
        .upload-file-name {
          color: #15803d;
          font-size: 10px;
          font-weight: 600;
          overflow-wrap: anywhere;
          line-height: 1.5;
        }
        .form-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 30px;
          padding-top: 23px;
          border-top: 1px solid #edf0f5;
        }
        .btn-cancel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 12px 22px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-cancel:hover {
          background: #f8fafc;
        }
        .btn-submit {
          background: #1e40af;
          color: #ffffff;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-submit:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
      `}</style>

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Tambah Produk</h1>
          <p className="page-description">
            Tambahkan produk baru ke dalam katalog Apex Enthusiast.
          </p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="section-header">
              <h2 className="section-title">Informasi Produk</h2>
              <p className="section-description">
                Lengkapi informasi produk yang akan ditambahkan.
              </p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Nama Produk<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Masukkan nama produk"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Brand<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Masukkan brand produk"
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Deskripsi Produk</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Jelaskan detail dan keunggulan produk..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ukuran</label>
                <input
                  type="text"
                  name="ukuran"
                  value={formData.ukuran}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contoh: 39, 40, 41, 42"
                />
                <p className="input-hint">
                  Masukkan ukuran produk yang tersedia.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Pilih Kategori<span className="required">*</span>
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Sepak Bola">Sepak Bola</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Running">Running</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Buat Kategori Baru</label>
                <input
                  type="text"
                  value={kategoriBaru}
                  onChange={(e) => setKategoriBaru(e.target.value)}
                  className="form-input"
                  placeholder="Contoh: Sepatu Basket"
                />
                <p className="input-hint">
                  Isi jika ingin menggunakan kategori baru.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Stok<span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="stok"
                  value={formData.stok}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Masukkan jumlah stok"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Harga<span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Masukkan harga produk"
                />
              </div>
            </div>

            <div className="upload-section">
              <div className="section-header">
                <h2 className="section-title">Galeri Foto Produk</h2>
                <p className="section-description">
                  Upload hingga 5 foto untuk menampilkan produk dari berbagai sudut.
                </p>
              </div>

              <div className="upload-grid">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="upload-box">
                    <div className="upload-icon">
                      {images[index] ? "✓" : "+"}
                    </div>
                    <div className="upload-title">
                      Foto Produk {index + 1}
                    </div>
                    <div className="upload-desc">
                      {images[index] ? "Foto berhasil dipilih" : "Pilih gambar produk"}
                    </div>

                    <input
                      id={`upload-${index}`}
                      type="file"
                      accept="image/*"
                      className="upload-input"
                      onChange={(e) => handleSingleImageChange(index, e)}
                    />

                    <label
                      htmlFor={`upload-${index}`}
                      className="upload-action"
                    >
                      {images[index] ? (
                        <span className="upload-file-name">
                          {images[index]?.name}
                        </span>
                      ) : (
                        "+ Pilih Foto"
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => router.push("/admin/produk")}
              >
                Kembali
              </button>
              <button type="submit" className="btn-submit">
                Simpan Produk
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
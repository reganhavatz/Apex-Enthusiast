"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

interface FormData {
  nama: string;
  deskripsi: string;
  brand: string;
  stok: string;
  harga: string;
  jenis: string;
  kategori: string;
  kategoriBaru: string;
  ukuran: string;
}

export default function EditProduk() {
  const params = useParams();
  const router = useRouter();
  const idProduk = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newImages, setNewImages] = useState<(File | null)[]>([null, null, null, null, null]);
  const [oldImages, setOldImages] = useState<string[]>(["", "", "", "", ""]);
  const [previews, setPreviews] = useState<string[]>(["", "", "", "", ""]);

  const [formData, setFormData] = useState<FormData>({
    nama: "",
    brand: "",
    deskripsi: "",
    stok: "",
    harga: "",
    jenis: "",
    kategori: "",
    kategoriBaru: "",
    ukuran: "",
  });

  const getImageUrl = (filename: string) => {
    if (!filename) return "";
    if (filename.startsWith("http") || filename.startsWith("blob:")) return filename;
    return `http://localhost/api/uploads/${filename.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    if (!idProduk) return;

    async function ambilDetailProduk() {
      try {
        const res = await fetch(`http://localhost/api/get_produk_detail.php?id=${idProduk}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data) {
          const opsiKategori = ["SEPAK BOLA", "FUTSAL", "SEPATU LARI"];
          const kategoriDb = (data.kategori || "").trim();
          const matchedKategori = opsiKategori.find(
            (opt) => opt.toLowerCase() === kategoriDb.toLowerCase()
          );

          const opsiJenis = ["PRIA", "WANITA", "ANAK"];
          const jenisDb = (data.jenis || "").trim();
          const matchedJenis =
            opsiJenis.find((opt) => opt.toLowerCase() === jenisDb.toLowerCase()) || jenisDb;

          setFormData({
            nama: data.nama || "",
            brand: data.brand || "",
            deskripsi: data.deskripsi || "",
            stok: data.stok !== undefined && data.stok !== null ? String(data.stok) : "",
            harga: data.harga !== undefined && data.harga !== null ? String(data.harga) : "",
            jenis: matchedJenis,
            kategori: matchedKategori || "",
            kategoriBaru: !matchedKategori && kategoriDb ? kategoriDb : "",
            ukuran: Array.isArray(data.ukuran) ? data.ukuran.join(", ") : data.ukuran || "",
          });

          const existingImgs: string[] =
            Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : data.image
              ? [data.image]
              : [];

          const paddedOld = [0, 1, 2, 3, 4].map((idx) => existingImgs[idx] || "");
          setOldImages(paddedOld);
          setPreviews(paddedOld.map((img) => getImageUrl(img)));
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

  const handleSlotImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewImages((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });

    const objectUrl = URL.createObjectURL(file);
    setPreviews((prev) => {
      const updated = [...prev];
      updated[index] = objectUrl;
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const kategoriFinal = formData.kategoriBaru.trim() || formData.kategori;

    const dataToSend = new FormData();
    dataToSend.append("id", String(idProduk));
    dataToSend.append("nama", formData.nama);
    dataToSend.append("brand", formData.brand);
    dataToSend.append("deskripsi", formData.deskripsi);
    dataToSend.append("stok", formData.stok);
    dataToSend.append("harga", formData.harga);
    dataToSend.append("jenis", formData.jenis);
    dataToSend.append("kategori", kategoriFinal);
    dataToSend.append("ukuran", formData.ukuran);

    if (newImages[0]) {
      dataToSend.append("image", newImages[0]);
    }

    newImages.forEach((file, idx) => {
      if (file) {
        dataToSend.append(`images[${idx}]`, file);
        dataToSend.append(`foto_${idx + 1}`, file);
      }
      dataToSend.append(`old_images[${idx}]`, oldImages[idx] || "");
    });

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
        alert(`Gagal memperbarui produk: ${result?.message || "Kesalahan tidak diketahui"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Memuat data produk...</div>;
  }

  return (
    <>
      <style jsx>{`
        .loading-state {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #eff6ff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #475569;
          font-size: 14px;
        }

        .page-wrapper {
          flex: 1;
          min-width: 0;
          min-height: 100vh;
          background-color: #eff6ff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          box-sizing: border-box;
        }

        .main-content {
          max-width: 980px;
          width: 100%;
          margin: -40px auto;
          padding: 36px 28px 64px 28px;
          box-sizing: border-box;
          margin-left:260px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .page-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .form-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px 36px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.03);
          box-sizing: border-box;
        }

        .section-block {
          padding-bottom: 28px;
          margin-bottom: 28px;
          border-bottom: 1px solid #f1f5f9;
        }

        .section-block:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .section-desc {
          font-size: 12px;
          color: #64748b;
          margin: 0 0 22px 0;
        }

        .two-col-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 20px;
          margin-bottom: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 18px;
        }

        .two-col-grid .form-group {
          margin-bottom: 0;
        }

        .form-label {
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 7px;
        }

        .required-star {
          color: #dc2626;
          margin-left: 2px;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          color: #0f172a;
          background-color: #ffffff;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #94a3b8;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .form-textarea {
          min-height: 105px;
          resize: vertical;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 14px top 50%;
          background-size: 10px auto;
          padding-right: 36px;
          cursor: pointer;
        }

        .field-hint {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 5px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }

        .photo-slot-card {
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          padding: 16px 10px;
          background-color: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          box-sizing: border-box;
        }

        .photo-preview-box {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          background-color: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          overflow: hidden;
          border: 1px solid #dbeafe;
          margin-bottom: 4px;
        }

        .photo-preview-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-slot-title {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }

        .photo-slot-sub {
          font-size: 10px;
          color: #64748b;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .photo-pick-btn {
          margin-top: 6px;
          width: 100%;
          background-color: #ffffff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          border-radius: 7px;
          padding: 7px 8px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }

        .photo-pick-btn:hover {
          background-color: #eff6ff;
          border-color: #93c5fd;
        }

        .photo-pick-btn input[type="file"] {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid #f1f5f9;
        }

        .btn-cancel {
          background-color: #ffffff;
          color: #334155;
          border: 1px solid #cbd5e1;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-cancel:hover {
          background-color: #f8fafc;
        }

        .btn-submit {
          background-color: #1d4ed8;
          color: #ffffff;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-submit:hover {
          background-color: #1e40af;
        }

        .btn-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .main-content {
            padding: 20px 16px 48px 16px;
          }

          .form-card {
            padding: 22px 18px;
          }

          .two-col-grid,
          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn-cancel,
          .btn-submit {
            width: 100%;
          }
        }
      `}</style>

      <div className="page-wrapper">
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Edit Produk</h1>
            <p className="page-subtitle">
              Perbarui informasi produk yang ada di dalam katalog.
            </p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="section-block">
                <h2 className="section-title">Informasi Produk</h2>
                <p className="section-desc">
                  Perbarui informasi produk yang akan ditampilkan.
                </p>

                <div className="two-col-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Nama Produk <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama"
                      className="form-input"
                      placeholder="Masukkan nama produk"
                      value={formData.nama}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Brand <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      className="form-input"
                      placeholder="Masukkan brand produk"
                      value={formData.brand}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Deskripsi Produk</label>
                  <textarea
                    name="deskripsi"
                    className="form-textarea"
                    placeholder="Jelaskan detail dan keunggulan produk..."
                    value={formData.deskripsi}
                    onChange={handleChange}
                  />
                </div>

                <div className="two-col-grid">
                  <div className="form-group">
                    <label className="form-label">Ukuran</label>
                    <input
                      type="text"
                      name="ukuran"
                      className="form-input"
                      placeholder="Contoh: 39, 40, 41, 42"
                      value={formData.ukuran}
                      onChange={handleChange}
                    />
                    <span className="field-hint">Masukkan ukuran produk yang tersedia.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Pilih Kategori <span className="required-star">*</span>
                    </label>
                    <select
                      name="kategori"
                      className="form-select"
                      value={formData.kategori}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          kategori: e.target.value,
                          kategoriBaru: "",
                        }))
                      }
                      required={!formData.kategoriBaru.trim()}
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="SEPAK BOLA">Sepak Bola</option>
                      <option value="FUTSAL">Futsal</option>
                      <option value="SEPATU LARI">Sepatu Lari</option>
                    </select>
                  </div>
                </div>

                <div className="two-col-grid">
                  <div className="form-group">
                    <label className="form-label">Buat Kategori Baru</label>
                    <input
                      type="text"
                      name="kategoriBaru"
                      className="form-input"
                      placeholder="Contoh: Sepatu Basket"
                      value={formData.kategoriBaru}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          kategoriBaru: e.target.value,
                          kategori: e.target.value.trim() ? "" : prev.kategori,
                        }))
                      }
                    />
                    <span className="field-hint">Isi jika ingin menggunakan kategori baru.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Stok <span className="required-star">*</span>
                    </label>
                    <input
                      type="number"
                      name="stok"
                      className="form-input"
                      placeholder="Masukkan jumlah stok"
                      value={formData.stok}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="two-col-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Harga <span className="required-star">*</span>
                    </label>
                    <input
                      type="number"
                      name="harga"
                      className="form-input"
                      placeholder="Masukkan harga produk"
                      value={formData.harga}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Jenis <span className="required-star">*</span>
                    </label>
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
                </div>
              </div>

              <div className="section-block">
                <h2 className="section-title">Galeri Foto Produk</h2>
                <p className="section-desc">
                  Upload hingga 5 foto untuk menampilkan produk dari berbagai sudut.
                </p>

                <div className="gallery-grid">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="photo-slot-card">
                      <div className="photo-preview-box">
                        {previews[idx] ? (
                          <img src={previews[idx]} alt={`Foto Produk ${idx + 1}`} />
                        ) : (
                          <span>+</span>
                        )}
                      </div>
                      <div className="photo-slot-title">Foto Produk {idx + 1}</div>
                      <div className="photo-slot-sub">
                        {newImages[idx]?.name || oldImages[idx] || "Pilih gambar produk"}
                      </div>
                      <label className="photo-pick-btn">
                        + Pilih Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlotImageChange(idx, e)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => router.push("/admin/produk")}
                >
                  Kembali
                </button>
                <button type="submit" className="btn-submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
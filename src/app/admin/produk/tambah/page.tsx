"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function TambahProduk() {
  const router = useRouter();

  // State untuk data teks form
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    stok: "",
    harga: "",
    kategori: "Sepak Bola",
    ukuran: "",
  });

  // State khusus untuk menampung banyak file gambar
  const [images, setImages] = useState<File[]>([]);

  // Handle perubahan input teks & select
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle saat admin memilih banyak file gambar
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(selectedFiles);
    }
  };

  // Handle saat tombol submit / simpan diklik
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nama", formData.nama);
    data.append("deskripsi", formData.deskripsi);
    data.append("stok", formData.stok);
    data.append("harga", formData.harga);
    data.append("kategori", formData.kategori);
    data.append("ukuran", formData.ukuran);

    // Masukkan setiap file gambar ke FormData dengan key "image[]"
    images.forEach((file) => {
      data.append("image[]", file);
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
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md my-6">
      <h2 className="text-2xl font-bold text-center mb-6">Tambah Produk</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAMA PRODUK */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Nama Produk
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama produk..."
          />
        </div>

        {/* DESKRIPSI */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Deskripsi
          </label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan deskripsi produk..."
          />
        </div>

        {/* UKURAN */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Ukuran (Opsional / Contoh: S, M, L, XL)
          </label>
          <input
            type="text"
            name="ukuran"
            value={formData.ukuran}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: 40, 41, 42 atau S, M, L"
          />
        </div>

        {/* STOK */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Stok
          </label>
          <input
            type="number"
            name="stok"
            value={formData.stok}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jumlah stok..."
          />
        </div>

        {/* HARGA */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Harga
          </label>
          <input
            type="number"
            name="harga"
            value={formData.harga}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Harga produk..."
          />
        </div>

        {/* KATEGORI */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Kategori
          </label>
          <select
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Sepak Bola">Sepak Bola</option>
            <option value="Futsal">Futsal</option>
            <option value="Running">Running</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Pilih Gambar (Bisa pilih lebih dari satu foto untuk galeri)
          </label>
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
          >
            <span className="text-sm font-medium text-gray-600 mb-2">
              {images.length > 0
                ? `${images.length} file gambar dipilih`
                : "Pilih Gambar"}
            </span>
            <span className="text-2xl font-bold text-gray-400">+</span>
            <input
              id="file-upload"
              type="file"
              multiple 
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </label>

          {images.length > 0 && (
            <ul className="mt-2 text-xs text-gray-500 space-y-1">
              {images.map((file, idx) => (
                <li key={idx}>• {file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ProdukDetailType {
  id: number;
  nama: string;
  harga: number;
  ukuran: string | string[];
  image: string;
  deskripsi?: string;
  stok?: number;
  images?: string[];
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [produk, setProduk] = useState<ProdukDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>("");
  const [listGambar, setListGambar] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    async function fetchDetailProduk() {
      try {
        const res = await fetch(`http://localhost/api/get_produk_detail.php?id=${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Gagal memuat data");

        const data = await res.json();
        setProduk(data);

        if (data?.image) setActiveImage(data.image);

        if (data?.images && Array.isArray(data.images) && data.images.length > 0) {
          setListGambar(data.images.filter(Boolean));
        } else if (data?.image) {
          setListGambar([data.image]);
        }

        if (data?.ukuran) {
          const sizesArray = Array.isArray(data.ukuran)
            ? data.ukuran
            : typeof data.ukuran === "string"
            ? data.ukuran.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];

          setAvailableSizes(sizesArray);
          if (sizesArray.length > 0) setSelectedSize(sizesArray[0]);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetailProduk();
  }, [id]);

  const handleTambahKeKeranjang = () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("Silakan login terlebih dahulu!");
      router.push("/auth/login");
      return;
    }

    if (!produk) return;

    const keranjangLama = JSON.parse(localStorage.getItem("cart_items") || "[]");
    const cekAda = keranjangLama.find(
      (item: any) => item.id === produk.id && item.ukuran === selectedSize
    );

    if (!cekAda) {
      const produkBaru = {
        id: produk.id,
        produk: produk.nama,
        deskripsi: produk.deskripsi || "Lorem ipsum dolor sim amet...",
        harga: `Rp ${Number(produk.harga).toLocaleString("id-ID")}`,
        stok: produk.stok ?? 28,
        image: activeImage || produk.image,
        ukuran: selectedSize,
      };

      localStorage.setItem("cart_items", JSON.stringify([...keranjangLama, produkBaru]));
    }

    alert("Produk berhasil ditambahkan ke keranjang!");
  };

  const handleBeliSekarang = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      e.preventDefault();
      alert("Silakan login terlebih dahulu!");
      router.push("/auth/login");
    }
  };

  if (loading) {
    return (
      <div className="status-container">
        <p>Memuat detail produk...</p>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="status-container">
        <p>Produk tidak ditemukan!</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          background-color: #ebf3fe;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;

        }
        .status-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #ebf3fe;
        }
        .main-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 48px 24px;
          margin-top: -10px;
        }
        .product-container {
          display: flex;
          gap: 48px;
          max-width: 960px;
          width: 100%;
          align-items: flex-start; 
        }
        .product-images {
          width: 360px;
          flex-shrink: 0;
        }
        .main-image {
          width: 100%;
          height: 400px;
          background-color: #ffffff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .main-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 12px;
        }
        .thumbnail-list {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        .thumb {
          width: 60px;
          height: 52px;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
        }
        .product-info {
          flex: 1; 
          display: flex;
          flex-direction: column;
          background-color: #ffffff; 
          padding: 24px; 
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .product-title {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }
        .price {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px 0;
        }
        .stock {
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .stock-status {
          color: #10b981;
        }
        .description {
          font-size: 12px;
          color: #334155;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .size-section {
          margin-bottom: 28px;
        }
        .size-label {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
        }
        .size-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .size-box {
          width: 32px;
          height: 32px;
          background-color: #64748b;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }
        .size-box.active {
          background-color: #1d52d8;
          
        }
        .action-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }
        .btn-cart {
          flex: 1;
          height: 44px;
          background-color: #bfdbfe;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s;
        }
        .btn-cart:hover {
          background-color: #93c5fd;
        }
        .btn-buy {
          flex: 1;
          height: 44px;
          background-color: #1d52d8;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-buy:hover {
          background-color: #1541b0;
        }
        @media (max-width: 768px) {
          .product-container {
            flex-direction: column;
          }
          .product-images {
            width: 100%;
          }
        }
      `}</style>

      <div className="page-wrapper">
        <main className="main-content">
          <section className="product-container">
            <div className="product-images">
              <div className="main-image">
                <img
                  src={`http://localhost/api/uploads/${activeImage || produk.image}`}
                  alt={produk.nama}
                />
              </div>
              
              <div className="thumbnail-list">
                {listGambar.map((img, i) => (
                  <div 
                    key={i} 
                    className="thumb"
                    onClick={() => setActiveImage(img)}
                    style={{
                      borderColor: activeImage === img ? "#1d52d8" : "transparent"
                    }}
                  >
                    <img 
                      src={`http://localhost/api/uploads/${img}`} 
                      alt={`Thumbnail ${i + 1}`} 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{produk.nama}</h1>
              <p className="price">
                Rp {Number(produk.harga).toLocaleString("id-ID")}.00
              </p>

              <p className="stock">
                STOK :{" "}
                <span
                  className="stock-status"
                  style={{ color: (produk.stok ?? 1) > 0 ? "#10b981" : "#ef4444" }}
                >
                  {(produk.stok ?? 1) > 0 ? "TERSEDIA" : "HABIS"}
                </span>
              </p>

              <p className="description">
                {produk.deskripsi ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
              </p>

              <div className="size-section">
                <div className="size-label">Size</div>
                <div className="size-options">
                  {availableSizes.length > 0 ? (
                    availableSizes.map((sz, idx) => (
                      <div 
                        key={idx} 
                        className={`size-box ${selectedSize === sz ? "active" : ""}`}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Tidak ada ukuran</span>
                  )}
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  type="button" 
                  className="btn-cart"
                  onClick={handleTambahKeKeranjang}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Keranjang
                </button>

                <Link
                  href={`/pembayaran?id=${produk.id}&ukuran=${selectedSize}`}
                  onClick={handleBeliSekarang}
                  style={{ flex: 1, textDecoration: "none" }}
                >
                  <button className="btn-buy" style={{ width: "100%" }}>
                    Beli Sekarang
                  </button>
                </Link>
              </div>

            </div>
          </section>
        </main>
      </div>
    </>
  );
}
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

export default function Keranjang() {
  const [items, setItems] = useState<any[]>([]);

  // Ambil data keranjang dari localStorage saat halaman pertama kali dibuka
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart_items") || "[]");
    setItems(savedCart);
  }, []);

  // Fungsi untuk menghapus item dari keranjang dan memperbarui localStorage
  const handleHapus = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem("cart_items", JSON.stringify(updatedItems));
  };

  // Fungsi helper untuk memotong deskripsi yang terlalu panjang
  const potongDeskripsi = (text: string, maxLength: number = 85) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <style jsx>{`
        .page-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: #ebf3fe;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .main-content {
          flex: 1;
          height: 100vh;
          overflow-y: auto;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-sizing: border-box;
        }
        .page-title {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 28px;
        }
        .card-container {
          width: 100%;
          max-width: 880px;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 32px 28px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
          min-height: 480px;
        }
        .cart-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .table-header {
          background-color: #f1f5f9;
          height: 42px;
        }
        .table-header th {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          padding: 0 12px;
          text-align: center;
        }
        .table-header th:first-child {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
        .table-header th:last-child {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .table-row td {
          padding: 24px 12px;
          font-size: 11px;
          color: #0f172a;
          vertical-align: middle;
        }
        .cell-no {
          text-align: center;
          font-weight: 600;
          width: 40px;
        }
        .cell-produk {
          width: 180px;
        }
        .product-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .product-image {
          width: 42px;
          height: 42px;
          border-radius: 6px;
          object-fit: contain;
          background-color: #cbd5e1;
          flex-shrink: 0;
        }
        .product-name {
          font-weight: 700;
          font-size: 11px;
          color: #1e293b;
          line-height: 1.3;
        }
        .cell-deskripsi {
          color: #475569;
          line-height: 1.4;
          max-width: 260px;
          font-size: 11px;
        }
        .cell-harga {
          text-align: center;
          font-weight: 600;
          width: 100px;
        }
        .cell-stok {
          text-align: center;
          font-weight: 600;
          width: 60px;
        }
        .cell-aksi {
          text-align: center;
          width: 90px;
        }
        .btn-hapus {
          background-color: #1d52d8;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-hapus:hover {
          background-color: #1541b0;
        }
        .empty-state {
          text-align: center;
          padding: 40px 0;
          color: #64748b;
          font-size: 13px;
        }
        @media (max-width: 768px) {
          .main-content {
            padding: 24px 16px;
          }
          .card-container {
            padding: 16px;
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="page-container">
        <Sidebar />

        <main className="main-content">
          <h1 className="page-title">Keranjang</h1>

          <div className="card-container">
            {items.length > 0 ? (
              <table className="cart-table">
                <thead>
                  <tr className="table-header">
                    <th style={{ width: "5%" }}>No</th>
                    <th style={{ width: "25%", textAlign: "left" }}>Produk</th>
                    <th style={{ width: "35%", textAlign: "left" }}>Deskripsi</th>
                    <th style={{ width: "15%" }}>Harga</th>
                    <th style={{ width: "10%" }}>Stok</th>
                    <th style={{ width: "10%" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="table-row">
                      <td className="cell-no">{index + 1}</td>
                      <td className="cell-produk">
                        <div className="product-info">
                          <img 
                            src={`http://localhost/api/uploads/${item.image}`} 
                            alt={item.produk} 
                            className="product-image"
                          />
                          <span className="product-name">{item.produk}</span>
                        </div>
                      </td>
                      {/* Deskripsi dipotong menggunakan fungsi potongDeskripsi */}
                      <td className="cell-deskripsi">
                        {potongDeskripsi(item.deskripsi, 85)}
                      </td>
                      <td className="cell-harga">{item.harga}</td>
                      <td className="cell-stok">{item.stok}</td>
                      <td className="cell-aksi">
                        <button
                          type="button"
                          className="btn-hapus"
                          onClick={() => handleHapus(item.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                Keranjang belanjaan Anda masih kosong.
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
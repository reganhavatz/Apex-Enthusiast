"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("Diproses");
  const [orders, setOrders] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const tabs = ["Diproses", "Dikemas", "Dikirim", "Diterima", "Dibatalkan"];

  useEffect(() => {
    setIsMounted(true);
    const savedOrders = JSON.parse(localStorage.getItem("admin_orders") || "[]");
    setOrders(savedOrders);
  }, []);

  if (!isMounted) {
    return null;
  }

  const filteredOrders = orders.filter((item) => item.status === activeTab);

  return (
    <>
      <style jsx>{`
        .history-page {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: #ebf3fe;
          font-family: sans-serif;
          box-sizing: border-box;
        }
        .history-main {
          flex: 1;
          height: 100vh;
          overflow-y: auto;
          padding: 48px 24px 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
        }
        .history-title {
          font-size: 26px;
          font-weight: bold;
          color: #0f172a;
          text-align: center;
          margin-bottom: 28px;
        }
        .history-card {
          width: 100%;
          max-width: 820px;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 40px 48px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          height: auto;
          min-height: auto;
          box-sizing: border-box;
        }
        .tab-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }
        .order-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px 20px;
          transition: all 0.2s ease;
        }
        .order-row:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          border-color: #cbd5e1;
        }
        .order-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .img-placeholder {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }
        .img-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .no-image-text {
          font-size: 9px;
          color: #94a3b8;
          text-align: center;
        }
        .order-info {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          color: #334155;
          gap: 4px;
        }
        .product-name {
          font-size: 14px;
          font-weight: bold;
          color: #0f172a;
        }
        .order-right {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .order-total {
          font-size: 14px;
          font-weight: bold;
          color: #1d52d8;
        }
        .order-date {
          font-size: 11px;
          color: #94a3b8;
        }
        .empty-state {
          text-align: center;
          padding: 40px 0;
          color: #64748b;
          font-size: 13px;
        }
        .order-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>

      <div className="history-page">
        <Sidebar />
        <main className="history-main">
          <h1 className="history-title">Riwayat Pesanan</h1>
          <div className="history-card">
            
            <div className="tab-bar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    style={{ 
                      backgroundColor: isActive ? "#1d52d8" : "#ffffff", 
                      color: isActive ? "#ffffff" : "#1e293b" 
                    }}
                    className="tab-btn"
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="order-list-wrapper">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((item) => (
                  <div key={item.id} className="order-row">
                    <div className="order-left">
                      <div className="img-placeholder">
                        {item.image || item.foto ? (
                          <img src={item.image || item.foto} alt={item.namaProduk} />
                        ) : (
                          <span className="no-image-text">No Image</span>
                        )}
                      </div>
                      <div className="order-info">
                        <div className="product-name">{item.namaProduk || "Produk"}</div>
                        <div>ID: <strong>{item.id}</strong> • Kurir: <strong>{item.kurir || "-"}</strong></div>
                      </div>
                    </div>
                    
                    <div className="order-right">
                      <div className="order-total">{item.total || "Rp 0"}</div>
                      <div className="order-date">{item.tanggal || "-"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  Tidak ada pesanan dengan status "{activeTab}".
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <style jsx>{`
        .tab-btn {
          width: 110px;
          height: 42px;
          border-radius: 6px;
          border: none;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: background-color 0.2s;
        }
      `}</style>
    </>
  );
}
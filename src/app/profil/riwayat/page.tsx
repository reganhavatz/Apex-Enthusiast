"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("Pesanan Baru");
  const [orders, setOrders] = useState<any[]>([]);
  const [openedCounts, setOpenedCounts] = useState<{ [key: string]: number }>({});
  const [isMounted, setIsMounted] = useState(false);

  const tabs = [
    "Pesanan Baru",
    "Diproses",
    "Dikemas",
    "Dikirim",
    "Diterima",
    "Dibatalkan",
    "Pesanan Gagal",
  ];

  const fetchOrders = () => {
    try {
      const data = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchOrders();

    try {
      const savedOpened = JSON.parse(localStorage.getItem("order_tab_opened_counts") || "{}");
      setOpenedCounts(savedOpened);
    } catch (e) {
      console.error(e);
    }

    window.addEventListener("storage", fetchOrders);
    return () => {
      window.removeEventListener("storage", fetchOrders);
    };
  }, []);

  const handleTabClick = (tab: string, currentCount: number) => {
    setActiveTab(tab);

    if (currentCount > 0) {
      setOpenedCounts((prev) => {
        if ((prev[tab] || 0) >= currentCount) return prev;
        const updated = { ...prev, [tab]: currentCount };
        localStorage.setItem("order_tab_opened_counts", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const saveAndSync = (updatedOrders: any[]) => {
    try {
      const listAman = updatedOrders.slice(0, 15);
      const stringData = JSON.stringify(listAman);

      setOrders(listAman);
      localStorage.setItem("orders", stringData);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      alert("Memori browser penuh! Harap gunakan gambar ukuran lebih kecil.");
    }
  };

  const handleUploadBukti = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("Ukuran gambar maksimal 800 KB agar memori tidak penuh!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedOrders = orders.map((item) => {
          if (item.id === id) {
            return { ...item, buktiTransfer: base64String };
          }
          return item;
        });
        saveAndSync(updatedOrders);
        alert("Bukti transfer berhasil diunggah!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelOrder = (id: string) => {
    if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      const updatedOrders = orders.map((item) => {
        if (item.id === id) {
          return { ...item, status: "Dibatalkan" };
        }
        return item;
      });
      saveAndSync(updatedOrders);
      alert("Pesanan berhasil dibatalkan.");
    }
  };

  const handleConfirmReceived = (id: string) => {
    if (confirm("Apakah Anda yakin pesanan sudah diterima?")) {
      const updatedOrders = orders.map((item) => {
        if (item.id === id) {
          return { ...item, status: "Diterima" };
        }
        return item;
      });
      saveAndSync(updatedOrders);
      alert("Status pesanan diperbarui menjadi Diterima!");
    }
  };

  if (!isMounted) {
    return null;
  }

  const filteredOrders = orders.filter((item) => (item.status || "Pesanan Baru") === activeTab);

  return (
    <>
      <style jsx>{`
        .history-page {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: #eef3fb;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          box-sizing: border-box;
        }

        .history-main {
          flex: 1;
          min-height: 100vh;
          overflow-y: auto;
          padding: 36px 40px 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          
          margin-left:200px;
        }

        .history-title {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin: 0 0 24px 0;
        }

        .history-card {
          width: 100%;
          max-width: 880px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px 36px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
          box-sizing: border-box;
        }

        .tab-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          padding-bottom: 18px;
          border-bottom: 1px solid #f1f5f9;
        }

        .tab-btn {
          position: relative;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          color: #1e293b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .tab-btn:hover {
          background-color: #f8fafc;
          border-color: #cbd5e1;
        }

        .tab-btn.active {
          background-color: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }

        .blue-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #2563eb;
          display: inline-block;
          flex-shrink: 0;
        }

        .tab-btn.active .blue-dot {
          background-color: #ffffff;
        }

        .tab-count-text {
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
        }

        .tab-btn.active .tab-count-text {
          color: #ffffff;
        }

        .order-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .order-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 20px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .order-row:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
        }

        .order-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .img-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 10px;
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
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          text-align: center;
        }

        .order-info {
          display: flex;
          flex-direction: column;
          font-size: 12px;
          color: #475569;
          gap: 4px;
        }

        .product-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .resi-text {
          color: #c2410c;
          font-weight: 700;
        }

        .order-right {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
          flex-shrink: 0;
        }

        .order-total {
          font-size: 14px;
          font-weight: 700;
          color: #2563eb;
        }

        .order-date {
          font-size: 11px;
          color: #94a3b8;
        }

        .action-group {
          display: flex;
          gap: 6px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .upload-input-label {
          background-color: #2563eb;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: inline-block;
          transition: background-color 0.15s ease;
        }

        .upload-input-label:hover {
          background-color: #1d4ed8;
        }

        .hidden-file-input {
          display: none;
        }

        .btn-terima-user {
          background-color: #16a34a;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-terima-user:hover {
          background-color: #15803d;
        }

        .btn-batal-user {
          background-color: #dc2626;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-batal-user:hover {
          background-color: #b91c1c;
        }

        .uploaded-badge {
          width: 100%;
          font-size: 10px;
          font-weight: 600;
          color: #16a34a;
          text-align: right;
        }

        .waiting-admin-text {
          font-size: 11px;
          color: #64748b;
          font-style: italic;
          text-align: right;
        }

        .empty-state {
          text-align: center;
          padding: 44px 16px;
          color: #64748b;
          font-size: 13px;
          background-color: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .history-main {
            padding: 20px 16px 64px 16px;
          }

          .history-card {
            padding: 20px 16px;
          }

          .order-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-right {
            width: 100%;
            align-items: flex-start;
            text-align: left;
            padding-top: 10px;
            border-top: 1px solid #f1f5f9;
          }

          .action-group,
          .uploaded-badge,
          .waiting-admin-text {
            justify-content: flex-start;
            text-align: left;
          }
        }
      `}</style>

      <div className="history-page">
        <Sidebar />
        <main className="history-main">
       

          <div className="history-card">
            <div className="tab-bar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                const count = orders.filter((item) => (item.status || "Pesanan Baru") === tab).length;
                const openedCount = openedCounts[tab] || 0;

                const hasNewDot = count > openedCount;
                const showNumber = !hasNewDot && openedCount > 0 && count > 0;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabClick(tab, count)}
                    className={`tab-btn ${isActive ? "active" : ""}`}
                  >
                    <span>{tab}</span>

                    {hasNewDot && <span className="blue-dot" />}

                    {showNumber && <span className="tab-count-text">({count})</span>}
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
                        <div>
                          ID: <strong>{item.id}</strong> | Kurir: <strong>{item.kurir || "-"}</strong>
                        </div>
                        {item.resi && <div className="resi-text">No. Resi: {item.resi}</div>}
                      </div>
                    </div>

                    <div className="order-right">
                      <div className="order-total">{item.total || "Rp 0"}</div>
                      <div className="order-date">{item.tanggal || "-"}</div>

                      {item.status === "Pesanan Baru" && (
                        <>
                          {item.sudahDikonfirmasiAdmin ? (
                            <div className="action-group">
                              <label className="upload-input-label">
                                {item.buktiTransfer ? "Ganti Bukti TF" : "Upload Bukti TF"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden-file-input"
                                  onChange={(e) => handleUploadBukti(item.id, e)}
                                />
                              </label>
                              <button
                                type="button"
                                className="btn-batal-user"
                                onClick={() => handleCancelOrder(item.id)}
                              >
                                Batalkan
                              </button>
                              {item.buktiTransfer && (
                                <div className="uploaded-badge">✓ Terunggah</div>
                              )}
                            </div>
                          ) : (
                            <div className="waiting-admin-text">
                              Menunggu konfirmasi awal admin
                            </div>
                          )}
                        </>
                      )}

                      {item.status === "Dikirim" && (
                        <button
                          type="button"
                          className="btn-terima-user"
                          onClick={() => handleConfirmReceived(item.id)}
                        >
                          Pesanan Diterima
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  Tidak ada pesanan dengan status &ldquo;{activeTab}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
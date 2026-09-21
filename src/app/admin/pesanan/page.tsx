"use client";
import { useState, useEffect } from "react";

export default function PesananPage() {
  const [tabAktif, setTabAktif] = useState("Semua");
  const [listPesanan, setListPesanan] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("admin_orders") || "[]");
    setListPesanan(savedOrders);
  }, []);

  const handleUpdateStatus = (id: string, statusBaru: string) => {
    const updated = listPesanan.map((item) => {
      if (item.id === id) {
        return { ...item, status: statusBaru };
      }
      return item;
    });
    setListPesanan(updated);
    localStorage.setItem("admin_orders", JSON.stringify(updated));
  };

  // FUNGSI HAPUS PESANAN
  const handleDeleteOrder = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
      const updated = listPesanan.filter((item) => item.id !== id);
      setListPesanan(updated);
      localStorage.setItem("admin_orders", JSON.stringify(updated));
    }
  };

  const filteredList = tabAktif === "Semua"
    ? listPesanan
    : listPesanan.filter((item) => item.status === tabAktif);

  return (
    <>
      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background-color: #eff6ff;
          padding: 30px;
          font-family: sans-serif;
          box-sizing: border-box;
        }
        .admin-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #000;
        }
        .admin-top-card {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .admin-card-title {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
        }
        .admin-card-desc {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
          margin-bottom: 16px;
        }
        .filter-container {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-bottom-card {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          min-height: 300px;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          color: black;
        }
        .table-th {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: bold;
          background-color: #f3f4f6;
        }
        .table-td {
          padding: 16px;
          font-size: 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .aksi-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .status-select {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          background: #fff;
        }
        .btn-hapus {
          padding: 6px 10px;
          border-radius: 6px;
          border: none;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          background-color: #dc2626;
          color: white;
          margin-right:-50px;
        }
        .btn-hapus:hover {
          background-color: #b91c1c;
        }
        .empty-row-td {
          text-align: center;
          padding: 30px;
          color: #64748b;
          font-style: italic;
        }
      `}</style>

      <div className="admin-page">
        <h1 className="admin-title">Admin - Manajemen Pesanan</h1>

        <div className="admin-top-card">
          <h2 className="admin-card-title">Daftar Pesanan Masuk</h2>
          <p className="admin-card-desc">Kelola dan update status pesanan pembeli di sini</p>

          <div className="filter-container">
            {["Semua", "Diproses", "Dikemas", "Dikirim", "Diterima", "Dibatalkan"].map((item) => (
              <button
                key={item}
                style={{
                  backgroundColor: tabAktif === item ? "#1d4ed8" : "#ffffff",
                  color: tabAktif === item ? "#ffffff" : "#333",
                  borderColor: tabAktif === item ? "#1d4ed8" : "#e5e7eb"
                }}
                className="filter-btn"
                onClick={() => setTabAktif(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-bottom-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="table-th">ID PESANAN</th>
                <th className="table-th">PELANGGAN</th>
                <th className="table-th">METODE BAYAR</th>
                <th className="table-th">TOTAL</th>
                {/* Kolom 'STATUS SAAT INI' dihapus */}
                {/* Kolom 'UPDATE STATUS' diubah menjadi 'AKSI' */}
                <th className="table-th" style={{ textAlign: 'center' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((item, index) => (
                  <tr key={index}>
                    <td className="table-td">{item.id}</td>
                    <td className="table-td">{item.pelanggan}</td>
                    <td className="table-td">{item.metode}</td>
                    <td className="table-td">{item.total}</td>
                    {/* Gabungkan Dropdown Status dan Tombol Hapus dalam 1 TD */}
                    <td className="table-td">
                      <div className="aksi-wrapper">
                        <select
                          className="status-select"
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        >
                          <option value="Diproses">Diproses</option>
                          <option value="Dikemas">Dikemas</option>
                          <option value="Dikirim">Dikirim</option>
                          <option value="Diterima">Diterima</option>
                          <option value="Dibatalkan">Dibatalkan</option>
                        </select>

                        {/* Tombol Hapus Baru */}
                        <button
                          className="btn-hapus"
                          onClick={() => handleDeleteOrder(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-row-td">
                    Belum ada data pesanan pada kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
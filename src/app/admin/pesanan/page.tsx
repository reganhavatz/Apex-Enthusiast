"use client";
import { useState, useEffect } from "react";

export default function PesananPage() {
  const [tabAktif, setTabAktif] = useState("Semua");
  const [listPesanan, setListPesanan] = useState<any[]>([]);

  const [modalResiOpen, setModalResiOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [nomorResiInput, setNomorResiInput] = useState("");

  const [modalBuktiOpen, setModalBuktiOpen] = useState(false);
  const [selectedBuktiUrl, setSelectedBuktiUrl] = useState<string | null>(null);

  const fetchOrders = () => {
    try {
      const data = JSON.parse(localStorage.getItem("orders") || "[]");
      setListPesanan(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
    window.addEventListener("storage", fetchOrders);
    const interval = setInterval(fetchOrders, 1000);

    return () => {
      window.removeEventListener("storage", fetchOrders);
      clearInterval(interval);
    };
  }, []);

  const saveAndSync = (updated: any[]) => {
    try {
      setListPesanan(updated);
      localStorage.setItem("orders", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      alert("Penyimpanan lokal penuh! Harap hapus beberapa pesanan lama.");
    }
  };

  const handleUpdateStatus = (
    id: string,
    statusBaru: string,
    extraData = {}
  ) => {
    const updated = listPesanan.map((item) => {
      if (item.id === id) {
        return { ...item, status: statusBaru, ...extraData };
      }
      return item;
    });

    saveAndSync(updated);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
      const updated = listPesanan.filter((item) => item.id !== id);
      saveAndSync(updated);
    }
  };

  const handleBukaModalResi = (id: string) => {
    setSelectedOrderId(id);
    setNomorResiInput("");
    setModalResiOpen(true);
  };

  const handleSubmitResi = () => {
    if (!nomorResiInput.trim()) {
      alert("Nomor resi wajib diisi!");
      return;
    }

    if (selectedOrderId) {
      handleUpdateStatus(selectedOrderId, "Dikirim", {
        resi: nomorResiInput,
      });

      setModalResiOpen(false);
      setSelectedOrderId(null);

      alert("Pesanan berhasil dikirim dengan Nomor Resi: " + nomorResiInput);
    }
  };

  const handleBukaBukti = (url: string) => {
    setSelectedBuktiUrl(url);
    setModalBuktiOpen(true);
  };

  const filteredList =
    tabAktif === "Semua"
      ? listPesanan
      : listPesanan.filter(
          (item) => (item.status || "Pesanan Baru") === tabAktif
        );

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Pesanan Baru":
        return {
          bg: "#eff6ff",
          color: "#2563eb",
        };

      case "Diproses":
        return {
          bg: "#ecfdf5",
          color: "#059669",
        };

      case "Dikemas":
        return {
          bg: "#fffbeb",
          color: "#d97706",
        };

      case "Dikirim":
        return {
          bg: "#f5f3ff",
          color: "#7c3aed",
        };

      case "Diterima":
      case "Selesai":
        return {
          bg: "#f1f5f9",
          color: "#475569",
        };

      case "Dibatalkan":
      case "Pesanan Gagal":
        return {
          bg: "#fef2f2",
          color: "#dc2626",
        };

      default:
        return {
          bg: "#f1f5f9",
          color: "#475569",
        };
    }
  };

  const getInisial = (nama: string) => {
    if (!nama) return "PL";

    return nama
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <style jsx>{`
        .admin-page {
          width: calc(100% - 270px);
          min-height: 100vh;
          margin-left: 270px;
          margin-top: -40px;
          padding: 28px 24px 40px;
          box-sizing: border-box;
          color: #1e293b;
          font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        }

        .admin-title {
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.6px;
          color: #172b4d;
          margin: 0 0 23px;
        }

        .admin-top-card {
          background: #ffffff;
          padding: 26px 28px;
          border-radius: 15px;
          margin-bottom: 20px;
          border: 1px solid #edf0f5;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
        }

        .admin-card-title {
          font-size: 19px;
          font-weight: 750;
          margin: 0;
          color: #172b4d;
        }

        .admin-card-desc {
          font-size: 13px;
          color: #8795aa;
          margin: 6px 0 22px;
          line-height: 1.6;
        }

        .filter-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 11px 16px;
          border-radius: 9px;
          border: 1px solid #e5eaf1;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #ffffff;
          color: #52627a;
          white-space: nowrap;
        }

        .filter-btn:hover {
          border-color: #2563eb;
          color: #2563eb;
          background: #f5f8ff;
        }

        .admin-bottom-card {
          width: 100%;
          background: #ffffff;
          padding: 8px 20px 20px;
          box-sizing: border-box;
          border-radius: 15px;
          border: 1px solid #edf0f5;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.025);
        }

        .admin-table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          text-align: left;
        }

        .col-id {
          width: 11%;
        }

        .col-customer {
          width: 16%;
        }

        .col-method {
          width: 15%;
        }

        .col-date {
          width: 11%;
        }

        .col-total {
          width: 12%;
        }

        .col-status {
          width: 13%;
        }

        .col-action {
          width: 22%;
        }

        .table-th {
          padding: 19px 8px;
          font-size: 13px;
          font-weight: 750;
          color: #52627a;
          background: #ffffff;
          border-bottom: 1px solid #edf0f5;
          text-align: center;
          vertical-align: middle;
        }

        .table-td {
          padding: 20px 8px;
          font-size: 13px;
          border-bottom: 1px solid #f0f2f6;
          vertical-align: middle;
          color: #52627a;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .admin-table tbody tr {
          transition: background 0.2s ease;
        }

        .admin-table tbody tr:hover {
          background: #f8faff;
        }

        .admin-table tbody tr:last-child .table-td {
          border-bottom: none;
        }

        .customer-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .customer-info {
          min-width: 0;
        }

        .avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #edf4ff;
          color: #2563eb;
          font-weight: 750;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cust-name {
          font-weight: 700;
          color: #25364d;
          display: block;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .cust-sub {
          font-size: 11.5px;
          color: #98a5b7;
          display: block;
          margin-top: 3px;
        }

        .order-id {
          font-weight: 700;
          color: #26374e;
          font-size: 12.5px;
          overflow-wrap: anywhere;
        }

        .order-total {
          font-weight: 750;
          color: #24364e;
          font-size: 13px;
          white-space: nowrap;
        }

        .order-date {
          color: #8998ae;
          font-size: 12.5px;
          overflow-wrap: anywhere;
        }

        .payment-method {
          overflow-wrap: anywhere;
          font-size: 12.5px;
        }

        .badge-status {
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: auto;
          min-width: 85px;
          box-sizing: border-box;
          border: none;
          text-align: center;
          white-space: nowrap;
        }

        .action-row {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
          width: 100%;
        }

        .btn-pill {
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          text-align: center;
          white-space: nowrap;
        }

        .btn-proses-custom {
          background: #ffffff;
          color: #2563eb;
          border-color: #bfdbfe;
        }

        .btn-proses-custom:hover {
          background: #2563eb;
          color: #ffffff;
        }

        .btn-batal-custom {
          background: #ffffff;
          color: #dc2626;
          border-color: #fecaca;
        }

        .btn-batal-custom:hover {
          background: #fef2f2;
          border-color: #dc2626;
        }

        .btn-kemas {
          background: #9333ea;
          color: #ffffff;
        }

        .btn-kemas:hover {
          background: #7e22ce;
        }

        .btn-kirim {
          background: #2563eb;
          color: #ffffff;
        }

        .btn-kirim:hover {
          background: #1d4ed8;
        }

        .btn-konfirmasi {
          background: #16a34a;
          color: #ffffff;
        }

        .btn-konfirmasi:hover {
          background: #15803d;
        }

        .btn-cek {
          background: #ffffff;
          color: #0284c7;
          border: 1px solid #bae6fd;
        }

        .btn-cek:hover {
          background: #f0f9ff;
        }

        .resi-wait-text {
          display: block;
          max-width: 100%;
          font-size: 11.5px;
          color: #64748b;
          font-weight: 600;
          overflow-wrap: anywhere;
        }

        .empty-row-td {
          text-align: center;
          padding: 50px 10px;
          color: #94a3b8;
          font-size: 13px;
        }

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 15px;
          padding-top: 16px;
          border-top: 1px solid #edf0f5;
          font-size: 12px;
          color: #94a3b8;
        }

        .table-footer strong {
          color: #334155;
          font-weight: 700;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .page-btn {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          border: 1px solid #edf0f5;
          background: #ffffff;
          color: #64748b;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: 0.2s;
        }

        .page-btn:hover {
          background: #eff6ff;
          color: #2563eb;
        }

        .page-btn.active {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.48);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 999;
        }

        .modal-content {
          background: #ffffff;
          padding: 28px;
          border-radius: 16px;
          width: 420px;
          max-width: 100%;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.16);
          animation: modalShow 0.2s ease;
        }

        @keyframes modalShow {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-title {
          font-size: 17px;
          font-weight: 750;
          margin-bottom: 8px;
          color: #1e293b;
        }

        .modal-subtitle {
          font-size: 13px;
          color: #8998ae;
          margin-bottom: 18px;
          line-height: 1.7;
        }

        .modal-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          font-size: 13px;
          margin-bottom: 20px;
          box-sizing: border-box;
          outline: none;
          color: #334155;
        }

        .modal-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-secondary {
          background: #ffffff;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 9px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 650;
          font-size: 12px;
        }

        .btn-secondary:hover {
          background: #f8fafc;
        }

        .bukti-img-box {
          background: #f8fafc;
          border: 1px solid #edf0f5;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 18px;
        }

        @media (max-width: 1100px) {
          .admin-page {
            padding: 25px 16px 35px;
          }

          .admin-bottom-card {
            padding-left: 12px;
            padding-right: 12px;
          }

          .table-th {
            font-size: 11.5px;
            padding-left: 5px;
            padding-right: 5px;
          }

          .table-td {
            font-size: 11.5px;
            padding: 16px 5px;
          }

          .btn-pill {
            font-size: 10px;
            padding: 7px 6px;
          }

          .badge-status {
            font-size: 10px;
            min-width: 75px;
          }
        }

        @media (max-width: 768px) {
          .admin-page {
            width: 100%;
            margin-left: 0;
            margin-top: 0;
            padding: 22px 12px 30px;
          }

          .admin-title {
            font-size: 20px;
          }

          .admin-top-card {
            padding: 20px 16px;
          }

          .admin-card-title {
            font-size: 16px;
          }

          .filter-container {
            justify-content: flex-start;
            gap: 7px;
          }

          .filter-btn {
            padding: 8px 10px;
            font-size: 10px;
          }

          .admin-bottom-card {
            padding: 8px 8px 16px;
          }

          .table-th {
            font-size: 9px;
            padding: 12px 3px;
            text-align: center;
          }

          .table-td {
            font-size: 9px;
            padding: 12px 3px;
          }

          .avatar-circle {
            width: 25px;
            height: 25px;
            font-size: 9px;
          }

          .customer-cell {
            gap: 4px;
          }

          .cust-name {
            font-size: 9px;
          }

          .cust-sub {
            font-size: 8px;
          }

          .badge-status {
            font-size: 8px;
            padding: 5px 3px;
            min-width: 0;
            white-space: normal;
          }

          .btn-pill {
            font-size: 8px;
            padding: 5px 4px;
            white-space: normal;
          }

          .order-id,
          .order-date,
          .order-total,
          .resi-wait-text,
          .payment-method {
            font-size: 9px;
          }

          .table-footer {
            font-size: 10px;
          }
        }

        @media (max-width: 400px) {
          .admin-title {
            font-size: 18px;
          }

          .admin-page {
            padding-left: 8px;
            padding-right: 8px;
          }

          .table-footer {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="admin-page">
        <div className="admin-top-card">
          <h2 className="admin-card-title">Daftar Pesanan Masuk</h2>

          <p className="admin-card-desc">
            Kelola dan update status pesanan pembeli dengan cepat di sini
          </p>

          <div className="filter-container">
            {[
              "Semua",
              "Pesanan Baru",
              "Diproses",
              "Dikemas",
              "Dikirim",
              "Diterima",
              "Dibatalkan",
            ].map((item) => (
              <button
                key={item}
                style={{
                  backgroundColor: tabAktif === item ? "#2563eb" : "#ffffff",
                  color: tabAktif === item ? "#ffffff" : "#52627a",
                  borderColor: tabAktif === item ? "#2563eb" : "#e5eaf1",
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
            <colgroup>
              <col className="col-id" />
              <col className="col-customer" />
              <col className="col-method" />
              <col className="col-date" />
              <col className="col-total" />
              <col className="col-status" />
              <col className="col-action" />
            </colgroup>

            <thead>
              <tr>
                <th className="table-th">ID Pesanan</th>
                <th className="table-th">Pelanggan</th>
                <th className="table-th">Metode Bayar</th>
                <th className="table-th">Tanggal</th>
                <th className="table-th">Total</th>
                <th className="table-th">Status</th>
                <th className="table-th">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((item, index) => {
                  const statusSaatIni = item.status || "Pesanan Baru";
                  const badgeStyle = getStatusBadgeStyle(statusSaatIni);
                  const isFinalStatus =
                    statusSaatIni === "Diterima" || statusSaatIni === "Dibatalkan";

                  return (
                    <tr key={index}>
                      <td className="table-td">
                        <div className="order-id">{item.id}</div>
                      </td>

                      <td className="table-td">
                        <div className="customer-cell">
                          <div className="avatar-circle">
                            {getInisial(item.pelanggan)}
                          </div>

                          <div className="customer-info">
                            <span className="cust-name">{item.pelanggan}</span>

                            <span className="cust-sub">1 item</span>
                          </div>
                        </div>
                      </td>

                      <td className="table-td">
                        <span className="payment-method">{item.metode}</span>
                      </td>

                      <td className="table-td">
                        <span className="order-date">
                          {item.tanggal || "25/10/2026"}
                        </span>
                      </td>

                      <td className="table-td">
                        <span className="order-total">{item.total}</span>
                      </td>

                      <td className="table-td" style={{ textAlign: "center" }}>
                        <span
                          className="badge-status"
                          style={{
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.color,
                          }}
                        >
                          {statusSaatIni}
                        </span>
                      </td>

                      <td className="table-td">
                        <div className="action-row">
                          {statusSaatIni === "Pesanan Baru" && (
                            <>
                              {!item.sudahDikonfirmasiAdmin ? (
                                <button
                                  className="btn-pill btn-konfirmasi"
                                  onClick={() =>
                                    handleUpdateStatus(item.id, "Pesanan Baru", {
                                      sudahDikonfirmasiAdmin: true,
                                    })
                                  }
                                >
                                  Konfirmasi
                                </button>
                              ) : (
                                <>
                                  <button
                                    className="btn-pill btn-cek"
                                    onClick={() =>
                                      handleBukaBukti(item.buktiTransfer)
                                    }
                                  >
                                    Cek TF
                                  </button>

                                  <button
                                    className="btn-pill btn-proses-custom"
                                    onClick={() =>
                                      handleUpdateStatus(item.id, "Diproses")
                                    }
                                  >
                                    Proses
                                  </button>
                                </>
                              )}
                            </>
                          )}

                          {statusSaatIni === "Diproses" && (
                            <button
                              className="btn-pill btn-kemas"
                              onClick={() =>
                                handleUpdateStatus(item.id, "Dikemas")
                              }
                            >
                              Kemas
                            </button>
                          )}

                          {statusSaatIni === "Dikemas" && (
                            <button
                              className="btn-pill btn-kirim"
                              onClick={() => handleBukaModalResi(item.id)}
                            >
                              Kirim (Resi)
                            </button>
                          )}

                          {statusSaatIni === "Dikirim" && (
                            <span className="resi-wait-text">
                              Resi: {item.resi || "-"}
                            </span>
                          )}

                          <button
                            className="btn-pill btn-batal-custom"
                            onClick={() => handleDeleteOrder(item.id)}
                          >
                            {isFinalStatus ? "Hapus" : "Batalkan"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="empty-row-td">
                    Belum ada data pesanan pada kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="table-footer">
            <span>
              Showing{" "}
              <strong>
                {filteredList.length > 0 ? `1-${filteredList.length}` : "0"}
              </strong>{" "}
              from <strong>{listPesanan.length}</strong> data
            </span>

            <div className="pagination">
              <button className="page-btn">&lt;</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {modalResiOpen && (
        <div className="modal-overlay" onClick={() => setModalResiOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Masukkan Nomor Resi Pengiriman</div>

            <p className="modal-subtitle">
              Pastikan nomor resi kurir sudah benar sebelum mengirim pesanan.
            </p>

            <input
              type="text"
              className="modal-input"
              placeholder="Contoh: JNT-987654321"
              value={nomorResiInput}
              onChange={(e) => setNomorResiInput(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setModalResiOpen(false)}
              >
                Batal
              </button>

              <button className="btn-pill btn-kirim" onClick={handleSubmitResi}>
                Konfirmasi Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {modalBuktiOpen && (
        <div className="modal-overlay" onClick={() => setModalBuktiOpen(false)}>
          <div
            className="modal-content"
            style={{ textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-title">Bukti Transfer Pembeli</div>

            <p className="modal-subtitle">
              Periksa kesesuaian nominal transfer sebelum memproses pesanan.
            </p>

            <div className="bukti-img-box">
              {selectedBuktiUrl ? (
                <img
                  src={selectedBuktiUrl}
                  alt="Bukti Transfer"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <p
                  style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    padding: "24px 0",
                  }}
                >
                  Tidak ada gambar bukti transfer.
                </p>
              )}
            </div>

            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button
                className="btn-secondary"
                onClick={() => setModalBuktiOpen(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
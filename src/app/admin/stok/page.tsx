"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

interface ProdukItem {
  id: number | string;
  nama: string;
  stok: number | string;
  ukuran?: string;
  kategori?: string;
  brand?: string;
}

type FilterStatus = "semua" | "kritis" | "habis" | "aman";

export default function KelolaStokPage() {
  const [produk, setProduk] = useState<ProdukItem[]>([]);
  const [draftStok, setDraftStok] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showToast = (type: "ok" | "err", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => {
      setToastMsg((prev) => (prev?.text === text ? null : prev));
    }, 2600);
  };

  useEffect(() => {
    async function fetchStokProduk() {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        const response = await fetch("/api/produk");
        if (!response.ok) {
          throw new Error("Gagal mengambil data stok dari database.");
        }

        const data = await response.json();
        const list: ProdukItem[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setProduk(list);
        localStorage.setItem("admin_products", JSON.stringify(list));

        const initialDraft: Record<string, number> = {};
        list.forEach((item) => {
          initialDraft[String(item.id)] = Math.max(0, Number(item.stok) || 0);
        });
        setDraftStok(initialDraft);
      } catch (err) {
        console.error("Error fetching stock:", err);
        setErrorMsg(
          "API /api/produk belum merespons. Memuat & menyimpan perubahan ke data lokal sementara."
        );

        const localData = localStorage.getItem("admin_products");
        if (localData) {
          try {
            const parsed: ProdukItem[] = JSON.parse(localData);
            const list = Array.isArray(parsed) ? parsed : [];
            setProduk(list);

            const initialDraft: Record<string, number> = {};
            list.forEach((item) => {
              initialDraft[String(item.id)] = Math.max(0, Number(item.stok) || 0);
            });
            setDraftStok(initialDraft);
          } catch {
            setProduk([]);
          }
        } else {
          setProduk([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchStokProduk();
  }, []);

  const getStatusStok = (stok: number | string) => {
    const jumlah = Number(stok);
    if (Number.isNaN(jumlah) || jumlah <= 0) {
      return { key: "habis" as const, text: "Habis", bg: "#fee2e2", color: "#991b1b" };
    }
    if (jumlah < 5) {
      return { key: "kritis" as const, text: "Kritis", bg: "#fef3c7", color: "#92400e" };
    }
    return { key: "aman" as const, text: "Aman", bg: "#d1fae5", color: "#065f46" };
  };

  const ringkasan = useMemo(() => {
    let habis = 0;
    let kritis = 0;
    let aman = 0;
    let totalUnit = 0;

    produk.forEach((item) => {
      const qty = Math.max(0, Number(item.stok) || 0);
      totalUnit += qty;
      if (qty <= 0) habis += 1;
      else if (qty < 5) kritis += 1;
      else aman += 1;
    });

    return { totalProduk: produk.length, totalUnit, habis, kritis, aman };
  }, [produk]);

  const produkTersaring = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return produk.filter((item) => {
      const status = getStatusStok(item.stok).key;
      if (filterStatus !== "semua" && status !== filterStatus) return false;

      if (!q) return true;
      const namaMatch = String(item.nama || "").toLowerCase().includes(q);
      const ukuranMatch = String(item.ukuran || "").toLowerCase().includes(q);
      const brandMatch = String(item.brand || item.kategori || "")
        .toLowerCase()
        .includes(q);
      return namaMatch || ukuranMatch || brandMatch;
    });
  }, [produk, searchQuery, filterStatus]);

  const ubahDraft = (id: string | number, deltaOrValue: number, isAbsolute = false) => {
    const key = String(id);
    setDraftStok((prev) => {
      const current = prev[key] ?? 0;
      const next = isAbsolute ? deltaOrValue : current + deltaOrValue;
      return {
        ...prev,
        [key]: Math.max(0, Math.round(next)),
      };
    });
  };

  const simpanStok = async (item: ProdukItem) => {
    const key = String(item.id);
    const stokBaru = Math.max(0, Number(draftStok[key] ?? item.stok) || 0);
    setSavingId(key);

    try {
      let apiSukses = false;
      try {
        const res = await fetch(`/api/produk/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stok: stokBaru }),
        });
        if (res.ok) apiSukses = true;
      } catch {
        // Fallback ke localStorage jika endpoint belum siap
      }

      const updatedList = produk.map((p) =>
        String(p.id) === key ? { ...p, stok: stokBaru } : p
      );
      setProduk(updatedList);
      localStorage.setItem("admin_products", JSON.stringify(updatedList));

      showToast(
        "ok",
        apiSukses
          ? `Stok "${item.nama}" diperbarui menjadi ${stokBaru} unit.`
          : `Stok "${item.nama}" disimpan ke lokal (${stokBaru} unit).`
      );
    } catch {
      showToast("err", "Gagal menyimpan perubahan stok.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin-left: 235px;
          margin-top: -40px;
          width: 1020px;
          background-color: #eff6ff;
        }

        .main-content {
          flex: 1;
          padding: 32px 40px;
          margin-left:30px;
        }

        .page-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .judul-halaman {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }

        .sub-halaman {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .toast {
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          border: 1px solid transparent;
        }

        .toast.ok {
          background-color: #ecfdf5;
          color: #065f46;
          border-color: #a7f3d0;
        }

        .toast.err {
          background-color: #fef2f2;
          color: #991b1b;
          border-color: #fecaca;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .kpi-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 18px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .kpi-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        .kpi-value {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .kpi-sub {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 3px;
        }

        .toolbar-card {
          background-color: #ffffff;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .filter-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-btn:hover {
          background-color: #eff6ff;
          color: #2563eb;
          border-color: #bfdbfe;
        }

        .filter-btn.active {
          background-color: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        .search-input {
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 13px;
          color: #0f172a;
          width: 240px;
          outline: none;
          background-color: #ffffff;
        }

        .search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .card-tabel {
          background-color: #ffffff;
          border-radius: 14px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .tabel {
          width: 100%;
          border-collapse: collapse;
        }

        .tabel-head {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .tabel-head th {
          padding: 13px 16px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .tabel-row {
          transition: background-color 0.15s ease;
        }

        .tabel-row:not(:last-child) td {
          border-bottom: 1px solid #f1f5f9;
        }

        .tabel-row:hover {
          background-color: #f8fafc;
        }

        .tabel-row td {
          padding: 14px 16px;
          font-size: 13px;
          color: #334155;
          vertical-align: middle;
        }

        .col-nama {
          font-weight: 700;
          color: #0f172a;
        }

        .meta-kecil {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 2px;
        }

        .stepper {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 3px 6px;
        }

        .step-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          color: #0f172a;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .step-btn:hover {
          background-color: #eff6ff;
          border-color: #93c5fd;
          color: #2563eb;
        }

        .stok-input {
          width: 48px;
          text-align: center;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          outline: none;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 700;
        }

        .aksi-group {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-simpan {
          background-color: #0f172a;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .btn-simpan:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .btn-simpan:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .btn-edit {
          display: inline-block;
          background-color: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          padding: 5px 11px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        .btn-edit:hover {
          background-color: #dbeafe;
        }

        .state-info {
          text-align: center;
          padding: 48px 24px;
          color: #64748b;
          font-size: 13px;
        }
      `}</style>

      <div className="layout">
        <main className="main-content">
          <div className="page-top">
            <div>
              <h1 className="judul-halaman">Kelola Stok Produk</h1>
              <p className="sub-halaman">
                Pantau ketersediaan ukuran &amp; sesuaikan jumlah stok secara langsung
              </p>
            </div>

            {toastMsg && (
              <div className={`toast ${toastMsg.type}`}>{toastMsg.text}</div>
            )}
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-label">Total SKU / Produk</div>
              <p className="kpi-value">{ringkasan.totalProduk}</p>
              <div className="kpi-sub">{ringkasan.totalUnit} total unit tersedia</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Stok Aman</div>
              <p className="kpi-value" style={{ color: "#065f46" }}>
                {ringkasan.aman}
              </p>
              <div className="kpi-sub">5 unit atau lebih</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Stok Kritis</div>
              <p className="kpi-value" style={{ color: "#92400e" }}>
                {ringkasan.kritis}
              </p>
              <div className="kpi-sub">Kurang dari 5 unit</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-label">Stok Habis</div>
              <p className="kpi-value" style={{ color: "#991b1b" }}>
                {ringkasan.habis}
              </p>
              <div className="kpi-sub">Perlu restock segera</div>
            </div>
          </div>

          <div className="toolbar-card">
            <div className="filter-group">
              <button
                type="button"
                className={`filter-btn ${filterStatus === "semua" ? "active" : ""}`}
                onClick={() => setFilterStatus("semua")}
              >
                Semua ({ringkasan.totalProduk})
              </button>
              <button
                type="button"
                className={`filter-btn ${filterStatus === "kritis" ? "active" : ""}`}
                onClick={() => setFilterStatus("kritis")}
              >
                Kritis ({ringkasan.kritis})
              </button>
              <button
                type="button"
                className={`filter-btn ${filterStatus === "habis" ? "active" : ""}`}
                onClick={() => setFilterStatus("habis")}
              >
                Habis ({ringkasan.habis})
              </button>
              <button
                type="button"
                className={`filter-btn ${filterStatus === "aman" ? "active" : ""}`}
                onClick={() => setFilterStatus("aman")}
              >
                Aman ({ringkasan.aman})
              </button>
            </div>

            <input
              type="text"
              className="search-input"
              placeholder="Cari nama produk atau ukuran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                backgroundColor: "#fef2f2",
                color: "#991b1b",
                borderRadius: "10px",
                fontSize: "12.5px",
                border: "1px solid #fecaca",
              }}
            >
              {errorMsg}
            </div>
          )}

          <div className="card-tabel">
            <table className="tabel">
              <thead>
                <tr className="tabel-head">
                  <th style={{ width: "33%", textAlign: "left" }}>PRODUK</th>
                  <th style={{ width: "12%", textAlign: "center" }}>UKURAN</th>
                  <th style={{ width: "21%", textAlign: "center" }}>ATUR STOK</th>
                  <th style={{ width: "13%", textAlign: "center" }}>STATUS</th>
                  <th style={{ width: "21%", textAlign: "center" }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="state-info">
                      Memuat data stok produk...
                    </td>
                  </tr>
                ) : produkTersaring.length > 0 ? (
                  produkTersaring.map((item) => {
                    const key = String(item.id);
                    const stokAktif = Math.max(0, Number(item.stok) || 0);
                    const stokDraft = draftStok[key] ?? stokAktif;
                    const adaPerubahan = stokDraft !== stokAktif;
                    const statusStok = getStatusStok(stokDraft);

                    return (
                      <tr key={key} className="tabel-row">
                        <td style={{ textAlign: "left" }}>
                          <div className="col-nama">{item.nama}</div>
                          {(item.brand || item.kategori) && (
                            <div className="meta-kecil">
                              {[item.brand, item.kategori].filter(Boolean).join(" • ")}
                            </div>
                          )}
                        </td>
                        <td style={{ color: "#475569", fontWeight: 600, textAlign: "center" }}>
                          {item.ukuran || "All Size"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div className="stepper">
                            <button
                              type="button"
                              className="step-btn"
                              onClick={() => ubahDraft(item.id, -1)}
                              title="Kurangi 1"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              className="stok-input"
                              value={stokDraft}
                              onChange={(e) =>
                                ubahDraft(item.id, Number(e.target.value) || 0, true)
                              }
                            />
                            <button
                              type="button"
                              className="step-btn"
                              onClick={() => ubahDraft(item.id, 1)}
                              title="Tambah 1"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              className="step-btn"
                              style={{ width: "auto", padding: "0 6px", fontSize: "11px" }}
                              onClick={() => ubahDraft(item.id, 5)}
                              title="Restock +5"
                            >
                              +5
                            </button>
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: statusStok.bg,
                              color: statusStok.color,
                            }}
                          >
                            {statusStok.text}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div className="aksi-group">
                            <button
                              type="button"
                              className="btn-simpan"
                              disabled={!adaPerubahan || savingId === key}
                              onClick={() => simpanStok(item)}
                            >
                              {savingId === key ? "..." : "Simpan"}
                            </button>
                            <Link href={`/admin/produk/edit/${item.id}`} className="btn-edit">
                              Detail
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="state-info">
                      Tidak ada produk yang cocok dengan filter atau pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
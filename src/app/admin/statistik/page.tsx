"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface GrafikItem {
  label: string;
  nilai: number;
}

const HARI_URUT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const GRAFIK_TAMPIL = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function parseAngka(val: unknown): number {
  if (typeof val === "number") return Number.isFinite(val) ? val : 0;
  if (typeof val === "string") {
    const cleaned = val.replace(/[^0-9-]/g, "");
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
}

function hitungOmsetTanpaOngkir(order: Record<string, any>): number {
  // 1. Jika ada subtotal eksplisit, pakai langsung
  const subtotalLangsung = parseAngka(
    order.subtotalNum ?? order.subtotal ?? order.totalProduk ?? order.productTotal
  );
  if (subtotalLangsung > 0) return subtotalLangsung;

  // 2. Jika ada array items/produk, hitung jumlah harga * qty
  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.produk)
    ? order.produk
    : null;

  if (items && items.length > 0) {
    const sumItems = items.reduce((sum: number, item: any) => {
      const harga = parseAngka(item.harga ?? item.price ?? item.hargaSatuan ?? 0);
      const qty = parseAngka(item.qty ?? item.jumlah ?? item.quantity ?? 1) || 1;
      return sum + harga * qty;
    }, 0);
    if (sumItems > 0) return sumItems;
  }

  // 3. Fallback: total bayar dikurangi ongkir
  const totalBayar = parseAngka(order.totalNum ?? order.total ?? order.totalBayar ?? 0);
  const ongkir = parseAngka(
    order.ongkirNum ??
      order.ongkir ??
      order.biayaOngkir ??
      order.ongkosKirim ??
      order.shippingCost ??
      order.shipping_cost ??
      0
  );

  return Math.max(0, totalBayar - ongkir);
}

function ekstrakHariIndex(order: Record<string, any>): number {
  const rawDate = order.tanggal ?? order.createdAt ?? order.date ?? order.waktu;
  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.getDay(); // 0 = Minggu, 1 = Senin, ...
    }

    const lower = String(rawDate).toLowerCase();
    if (lower.includes("sen")) return 1;
    if (lower.includes("sel")) return 2;
    if (lower.includes("rab")) return 3;
    if (lower.includes("kam")) return 4;
    if (lower.includes("jum")) return 5;
    if (lower.includes("sab")) return 6;
    if (lower.includes("min") || lower.includes("ming")) return 0;
  }
  return new Date().getDay();
}

function bangunGrafikMingguan(orders: Record<string, any>[]): GrafikItem[] {
  const counts: Record<string, number> = {
    Sen: 0,
    Sel: 0,
    Rab: 0,
    Kam: 0,
    Jum: 0,
    Sab: 0,
    Min: 0,
  };

  orders.forEach((order) => {
    const dayIdx = ekstrakHariIndex(order);
    const labelHari = HARI_URUT[dayIdx];
    const mapLabel = labelHari === "Min" ? "Min" : labelHari;
    if (counts[mapLabel] !== undefined) {
      counts[mapLabel] += 1;
    }
  });

  return GRAFIK_TAMPIL.map((label) => ({
    label,
    nilai: counts[label] ?? 0,
  }));
}

export default function DashboardStatistik() {
  const [totalOmset, setTotalOmset] = useState(0);
  const [jumlahPesananBaru, setJumlahPesananBaru] = useState(0);
  const [totalProduk, setTotalProduk] = useState(0);
  const [dataGrafik, setDataGrafik] = useState<GrafikItem[]>(
    GRAFIK_TAMPIL.map((label) => ({ label, nilai: 0 }))
  );

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [pesananTerbaru, setPesananTerbaru] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        const adminOrders = JSON.parse(localStorage.getItem("admin_orders") || "[]");
        const userOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const transaksiOrders = JSON.parse(localStorage.getItem("transaksi") || "[]");

        const mergedMap = new Map<string, any>();
        [...transaksiOrders, ...userOrders, ...adminOrders].forEach((item, idx) => {
          if (item && typeof item === "object") {
            const key = item.id ? String(item.id) : `order-${idx}-${item.tanggal || ""}`;
            mergedMap.set(key, item);
          }
        });

        const savedOrders = Array.from(mergedMap.values());

        if (savedOrders.length > 0) {
          setJumlahPesananBaru(savedOrders.length);
          setPesananTerbaru(savedOrders.slice(0, 5));

          const omsetBersihTotal = savedOrders.reduce(
            (acc, curr) => acc + hitungOmsetTanpaOngkir(curr),
            0
          );
          setTotalOmset(omsetBersihTotal);
          setDataGrafik(bangunGrafikMingguan(savedOrders));
        } else {
          setJumlahPesananBaru(0);
          setPesananTerbaru([]);
          setTotalOmset(0);
          setDataGrafik(GRAFIK_TAMPIL.map((label) => ({ label, nilai: 0 })));
        }
      } catch (e) {
        console.error("Gagal baca storage dashboard:", e);
      }
    };

    loadDashboardData();
    window.addEventListener("storage", loadDashboardData);
    const interval = setInterval(loadDashboardData, 1500);

    async function getProduk() {
      try {
        const res = await fetch("http://localhost/api/get_produk.php");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTotalProduk(data.length);
          } else if (Array.isArray(data?.data)) {
            setTotalProduk(data.data.length);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    getProduk();

    return () => {
      window.removeEventListener("storage", loadDashboardData);
      clearInterval(interval);
    };
  }, []);

  const width = 560;
  const height = 160;
  const paddingLeft = 38;
  const paddingRight = 22;
  const paddingTop = 16;
  const paddingBottom = 26;

  const nilaiTertinggi = Math.max(...dataGrafik.map((d) => d.nilai), 0);
  const maxScale = nilaiTertinggi <= 10 ? 10 : Math.ceil(nilaiTertinggi / 5) * 5;
  const stepTick = maxScale / 4;
  const gridTicks = [
    maxScale,
    Math.round(stepTick * 3),
    Math.round(stepTick * 2),
    Math.round(stepTick * 1),
    0,
  ];

  const points = dataGrafik.map((item, index) => {
    const x =
      paddingLeft +
      (index * (width - paddingLeft - paddingRight)) /
        Math.max(1, dataGrafik.length - 1);
    const y =
      height -
      paddingBottom -
      (item.nilai / maxScale) * (height - paddingTop - paddingBottom);
    return { x, y, ...item };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${
          points[0].x
        } ${height - paddingBottom} Z`
      : "";

  const totalTransaksiGrafik = dataGrafik.reduce((sum, item) => sum + item.nilai, 0);

  return (
    <>
      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          padding: 28px;
          font-family: system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
          margin-top: -40px;
          margin-left: 270px;
          max-width: 1080px;
        }
        .page-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }
        .judul {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 3px 0;
        }
        .sub-judul {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }
        .badge-info {
          font-size: 11px;
          font-weight: 600;
          color: #2563eb;
          background-color: #ffffff;
          border: 1px solid #dbeafe;
          padding: 5px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
          width: 100%;
        }
        .card-stat {
          background-color: #ffffff;
          padding: 18px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          position: relative;
          overflow: hidden;
        }
        .card-stat::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #2563eb;
        }
        .card-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .card-value {
          font-size: 23px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }
        .card-note {
          font-size: 11px;
          color: #64748b;
          margin: 0;
        }
        .chart-card {
          background-color: #ffffff;
          padding: 18px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          margin-bottom: 20px;
        }
        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .chart-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .chart-summary {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }
        .chart-box {
          position: relative;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          background-color: #f8fafc;
          border-radius: 10px;
          padding: 12px 14px;
          box-sizing: border-box;
          border: 1px solid #f1f5f9;
        }
        svg {
          width: 100%;
          max-height: 185px;
          height: auto;
          display: block;
          overflow: visible;
        }
        .grid-line {
          stroke: #e2e8f0;
          stroke-width: 1;
          stroke-dasharray: 3 3;
        }
        .axis-label {
          font-size: 10.5px;
          fill: #64748b;
          font-weight: 600;
        }
        .area-path {
          fill: rgba(37, 99, 235, 0.08);
        }
        .line-path {
          fill: none;
          stroke: #2563eb;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .point {
          fill: #ffffff;
          stroke: #2563eb;
          stroke-width: 2.5;
          cursor: pointer;
          transition: r 0.15s ease, fill 0.15s ease;
        }
        .point:hover,
        .point.active {
          fill: #2563eb;
          r: 6;
        }
        .tooltip {
          position: absolute;
          background-color: #0f172a;
          color: #ffffff;
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          transform: translate(-50%, -135%);
          pointer-events: none;
          white-space: nowrap;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
        }
        .card-tabel {
          background-color: #ffffff;
          padding: 18px 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }
        .subjudul {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 14px 0;
          color: #0f172a;
        }
        .tabel {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .tabel-head {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .tabel-head th {
          padding: 11px 14px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .tabel-row:not(:last-child) td {
          border-bottom: 1px solid #f1f5f9;
        }
        .tabel-row:hover {
          background-color: #f8fafc;
        }
        .tabel-row td {
          padding: 13px 14px;
          font-size: 13px;
          color: #334155;
          vertical-align: middle;
        }
        .status-pill {
          display: inline-block;
          padding: 3px 10px;
          background-color: #f0fdf4;
          color: #15803d;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid #dcfce7;
        }
        .btn-aksi {
          background-color: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          padding: 5px 12px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .btn-aksi:hover {
          background-color: #dbeafe;
        }
        .empty-state {
          text-align: center;
          padding: 28px;
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>

      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1 className="judul">Statistik Penjualan</h1>
            <p className="sub-judul">Ringkasan performa toko dan aktivitas pesanan terbaru</p>
          </div>
          <span className="badge-info">Omzet Bersih (Tanpa Ongkir)</span>
        </div>

        <div className="cards-grid">
          <div className="card-stat">
            <div className="card-label">TOTAL OMSET (BULAN INI)</div>
            <h2 className="card-value">Rp {totalOmset.toLocaleString("id-ID")}</h2>
            <p className="card-note">Tidak termasuk biaya pengiriman</p>
          </div>

          <div className="card-stat">
            <div className="card-label">PESANAN BARU</div>
            <h2 className="card-value">{jumlahPesananBaru}</h2>
            <p className="card-note">Terdata dari transaksi aktif</p>
          </div>

          <div className="card-stat">
            <div className="card-label">TOTAL PRODUK AKTIF</div>
            <h2 className="card-value">{totalProduk}</h2>
            <p className="card-note">Sinkron dengan katalog produk</p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Grafik Tren Penjualan Mingguan</h2>
            <span className="chart-summary">Total: {totalTransaksiGrafik} transaksi</span>
          </div>

          <div className="chart-box">
            {hoverIndex !== null && (
              <div
                className="tooltip"
                style={{
                  left: `${(points[hoverIndex].x / width) * 100}%`,
                  top: `${(points[hoverIndex].y / height) * 100}%`,
                }}
              >
                {points[hoverIndex].label}: {points[hoverIndex].nilai} Transaksi
              </div>
            )}

            <svg viewBox={`0 0 ${width} ${height}`}>
              {gridTicks.map((val, idx) => {
                const y =
                  height -
                  paddingBottom -
                  (val / maxScale) * (height - paddingTop - paddingBottom);

                return (
                  <g key={idx}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      className="grid-line"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      className="axis-label"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {areaD && <path d={areaD} className="area-path" />}
              {points.length > 0 && <path d={pathD} className="line-path" />}

              {points.map((p, i) => (
                <g key={i}>
                  <text
                    x={p.x}
                    y={height - 6}
                    textAnchor="middle"
                    className="axis-label"
                  >
                    {p.label}
                  </text>

                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    className={`point ${hoverIndex === i ? "active" : ""}`}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="card-tabel">
          <h2 className="subjudul">Pesanan Terbaru</h2>
          <table className="tabel">
            <thead>
              <tr className="tabel-head">
                <th>ID PESANAN</th>
                <th>TANGGAL</th>
                <th>PELANGGAN</th>
                <th>TOTAL BAYAR</th>
                <th>STATUS</th>
                <th style={{ textAlign: "center" }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {pesananTerbaru.length > 0 ? (
                pesananTerbaru.map((item, index) => (
                  <tr key={item.id || index} className="tabel-row">
                    <td style={{ fontWeight: 600 }}>{item.id || "ORD-" + (index + 1)}</td>
                    <td>{item.tanggal || "Hari ini"}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>
                      {item.pelanggan || item.nama || "Pelanggan"}
                    </td>
                    <td style={{ fontWeight: 700, color: "#0f172a" }}>
                      {item.total || `Rp ${parseAngka(item.totalNum).toLocaleString("id-ID")}`}
                    </td>
                    <td>
                      <span className="status-pill">
                        {item.status || "Menunggu Pembayaran"}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Link href="/admin/pesanan">
                        <button className="btn-aksi">Detail</button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty-state">
                    Belum ada pesanan terbaru.
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
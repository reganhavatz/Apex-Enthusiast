
"use client";
import { useState, useEffect } from "react";

export default function Keranjang() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart_items") || "[]"
    );
    setItems(savedCart);
  }, []);

  const handleHapus = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);

    setItems(updatedItems);
    localStorage.setItem("cart_items", JSON.stringify(updatedItems));
  };

  const potongDeskripsi = (text: string, maxLength: number = 85) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatRupiah = (harga: any) => {
    const angka = Number(String(harga).replace(/[^0-9]/g, ""));

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const filteredItems = items.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.produk?.toLowerCase().includes(keyword) ||
      item.deskripsi?.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #f5f7fb;
          font-family: Arial, Helvetica, sans-serif;
          margin-top:-20px;
        }

        .main-content {
          flex: 1;
          min-width: 0;
          min-height: 100vh;
          padding: 40px 45px;
          overflow-y: auto;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 27px;
          font-weight: 750;
          color: #172033;
          margin: 0 0 8px;
          letter-spacing: -0.7px;
        }

        .page-subtitle {
          font-size: 13px;
          color: #8791a3;
          margin: 0;
        }

        .cart-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .cart-summary h3 {
          font-size: 16px;
          font-weight: 700;
          color: #263247;
          margin: 0;
        }

        .cart-count {
          background: #e9efff;
          color: #315bd5;
          padding: 7px 13px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .card-container {
          width: 100%;
          background: #ffffff;
          border-radius: 14px;
          padding: 25px;
          border: 1px solid #edf0f5;
          box-shadow: 0 4px 18px rgba(20, 35, 70, 0.035);
        }

        /* Search */
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          gap: 15px;
        }

        .search-box {
          position: relative;
          width: 300px;
          max-width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #98a2b3;
          font-size: 16px;
        }

        .search-input {
          width: 100%;
          height: 40px;
          padding: 0 15px 0 38px;
          border: 1px solid #e5e9f0;
          border-radius: 8px;
          outline: none;
          font-size: 12px;
          color: #344054;
          background: #fff;
          transition: 0.2s;
        }

        .search-input:focus {
          border-color: #315bd5;
          box-shadow: 0 0 0 3px rgba(49, 91, 213, 0.08);
        }

        .search-input::placeholder {
          color: #a0a9b8;
        }

        .search-info {
          font-size: 11px;
          color: #98a2b3;
        }

        /* Table */
        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .cart-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 750px;
        }

        .table-header {
          background: #f7f8fc;
        }

        .table-header th {
          padding: 16px 13px;
          font-size: 11px;
          font-weight: 700;
          color: #8490a4;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .table-header th:first-child {
          border-radius: 8px 0 0 8px;
        }

        .table-header th:last-child {
          border-radius: 0 8px 8px 0;
        }

        .table-row {
          border-bottom: 1px solid #f0f2f6;
          transition: background 0.2s;
        }

        .table-row:hover {
          background: #fafbfe;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row td {
          padding: 19px 13px;
          font-size: 12px;
          color: #344054;
          vertical-align: middle;
        }

        .cell-no {
          text-align: center;
          color: #98a2b3 !important;
          font-weight: 600;
          width: 45px;
        }

        .cell-produk {
          min-width: 190px;
        }

        .product-info {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .product-image {
          width: 65px;
          height: 65px;
          border-radius: 10px;
          object-fit: contain;
          background: #f5f6fa;
          padding: 5px;
          flex-shrink: 0;
        }

        .product-name {
          font-size: 12px;
          font-weight: 700;
          color: #263247;
          line-height: 1.5;
          max-width: 130px;
        }

        .cell-deskripsi {
          color: #8490a4 !important;
          line-height: 1.7;
          max-width: 230px;
          font-size: 11px !important;
        }

        .cell-harga {
          text-align: center;
          font-weight: 700;
          color: #315bd5 !important;
          white-space: nowrap;
        }

        .cell-stok {
          text-align: center;
          font-weight: 600;
          color: #344054 !important;
        }

        .stok-label {
          display: inline-block;
          background: #ecfdf3;
          color: #159653;
          padding: 6px 11px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
        }

        .cell-aksi {
          text-align: center;
          width: 90px;
        }

        .btn-hapus {
          background: #fff1f0;
          color: #e04444;
          border: none;
          border-radius: 7px;
          padding: 9px 14px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-hapus:hover {
          background: #e04444;
          color: white;
        }

        /* Pagination */
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding-top: 22px;
          margin-top: 10px;
          border-top: 1px solid #f0f2f6;
        }

        .pagination-info {
          font-size: 11px;
          color: #98a2b3;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .page-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 9px;
          border: 1px solid #e8ebf1;
          background: white;
          color: #667085;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-btn:hover:not(:disabled) {
          border-color: #315bd5;
          color: #315bd5;
        }

        .page-btn.active {
          background: #315bd5;
          border-color: #315bd5;
          color: white;
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 75px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 75px;
          height: 75px;
          background: #f0f3fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 17px;
          color: #263247;
          margin: 0 0 9px;
        }

        .empty-state p {
          font-size: 12px;
          color: #98a2b3;
          margin: 0;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 25px 16px;
          }

          .page-title {
            font-size: 23px;
          }

          .card-container {
            padding: 15px;
          }

          .toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .pagination-container {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 22px 12px;
          }

          .card-container {
            padding: 12px;
          }

          .pagination {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="page-container">
        <main className="main-content">

          <div className="page-header">
            <h1 className="page-title">Keranjang</h1>
            <p className="page-subtitle">
              Kelola dan lihat produk yang telah kamu tambahkan ke keranjang.
            </p>
          </div>

          

          <div className="card-container">

            <div className="toolbar">
              <div className="search-box">
                <span className="search-icon">⌕</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Cari nama produk atau deskripsi..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <span className="search-info">
                {filteredItems.length} produk ditemukan
              </span>
            </div>

            {currentItems.length > 0 ? (
              <>
                <div className="table-wrapper">
                  <table className="cart-table">
                    <thead>
                      <tr className="table-header">
                        <th style={{ width: "5%" }}>No</th>
                        <th style={{ width: "22%", textAlign: "left" }}>
                          Produk
                        </th>
                        <th style={{ width: "30%", textAlign: "left" }}>
                          Deskripsi
                        </th>
                        <th style={{ width: "17%" }}>Harga</th>
                        <th style={{ width: "12%" }}>Stok</th>
                        <th style={{ width: "14%" }}>Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentItems.map((item, index) => (
                        <tr key={item.id} className="table-row">

                          {/* Numbering otomatis */}
                          <td className="cell-no">
                            {indexOfFirstItem + index + 1}
                          </td>

                          <td className="cell-produk">
                            <div className="product-info">
                              <img
                                src={`http://localhost/api/uploads/${item.image}`}
                                alt={item.produk}
                                className="product-image"
                              />

                              <span className="product-name">
                                {item.produk}
                              </span>
                            </div>
                          </td>

                          <td className="cell-deskripsi">
                            {potongDeskripsi(item.deskripsi, 85)}
                          </td>

                          <td className="cell-harga">
                            {formatRupiah(item.harga)}
                          </td>

                          <td className="cell-stok">
                            <span className="stok-label">
                              {item.stok}
                            </span>
                          </td>

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
                </div>

                {/* Pagination */}
                <div className="pagination-container">

                  <span className="pagination-info">
                    Menampilkan {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, filteredItems.length)} dari{" "}
                    {filteredItems.length} produk
                  </span>

                  <div className="pagination">

                    {/* Previous */}
                    <button
                      className="page-btn"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      ‹
                    </button>

                    {/* Nomor halaman */}
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        className={`page-btn ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next */}
                    <button
                      className="page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      ›
                    </button>

                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  {search ? "🔍" : "🛒"}
                </div>

                <h3>
                  {search
                    ? "Produk Tidak Ditemukan"
                    : "Keranjang Masih Kosong"}
                </h3>

                <p>
                  {search
                    ? "Coba gunakan kata kunci pencarian lainnya."
                    : "Belum ada produk yang ditambahkan ke keranjang."}
                </p>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}

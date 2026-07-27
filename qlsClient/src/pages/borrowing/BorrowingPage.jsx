import { useEffect, useMemo, useState } from "react";
import phieuMuonApi from "../../api/phieuMuonApi";
import docGiaApi from "../../api/docGiaApi";
import sachApi from "../../api/sachApi";
import BorrowFormModal from "../../components/borrowing/BorrowFormModal";
import ReturnBookModal from "../../components/borrowing/ReturnBookModal";
import StatusBadge from "../../components/common/StatusBadge";
import { useToast } from "../../components/common/ToastProvider.jsx";
import "../../styles/dashboard-ui.css";

const TABS = [
  { key: "all", label: "Toàn bộ" },
  { key: "Dang muon", label: "Đang mượn" },
  { key: "Qua han", label: "Quá hạn" },
  { key: "Da tra", label: "Đã trả" },
];

// Tính trạng thái hiển thị: nếu đang mượn mà quá hạn hẹn trả -> "Qua han"
function resolveStatus(phieu) {
  if (phieu.trangThai === "Dang muon" && phieu.ngayHenTra) {
    const today = new Date().toISOString().slice(0, 10);
    const hen = String(phieu.ngayHenTra).slice(0, 10);
    if (hen < today) return "Qua han";
  }
  return phieu.trangThai;
}

export default function BorrowingPage() {
  const [phieus, setPhieus] = useState([]);
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [returningPhieu, setReturningPhieu] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const toast = useToast();

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [phieuData, readerData, bookData] = await Promise.all([
        phieuMuonApi.getAll(),
        docGiaApi.getAll(),
        sachApi.getAll().catch(() => []), // module Sách có thể chưa sẵn sàng
      ]);
      setPhieus(phieuData);
      setReaders(readerData);
      setBooks(bookData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch dữ liệu khi mount, pattern chuẩn không dùng lib fetching riêng
    fetchAll();
  }, []);

  const readerMap = useMemo(
    () => Object.fromEntries(readers.map((r) => [r.maDocGia, r.hoTen])),
    [readers],
  );
  const bookMap = useMemo(
    () => Object.fromEntries(books.map((b) => [b.maSach, b.tenSach])),
    [books],
  );

  const filteredPhieus = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return phieus
      .map((p) => ({ ...p, displayStatus: resolveStatus(p) }))
      .filter((p) => (activeTab === "all" ? true : p.displayStatus === activeTab))
      .filter((p) => {
        if (!keyword) return true;
        return (
          p.maPhieu?.toLowerCase().includes(keyword) ||
          p.maDocGia?.toLowerCase().includes(keyword) ||
          p.maSach?.toLowerCase().includes(keyword) ||
          readerMap[p.maDocGia]?.toLowerCase().includes(keyword)
        );
      })
      .filter((p) => {
        const borrowDate = String(p.ngayMuon || '').slice(0, 10);
        if (fromDate && borrowDate < fromDate) return false;
        if (toDate && borrowDate > toDate) return false;
        return true;
      });
  }, [phieus, activeTab, search, readerMap, fromDate, toDate]);

  const handleCreate = async (form) => {
    try {
      await phieuMuonApi.create(form);
      setShowCreateModal(false);
      toast?.showToast('Tạo phiếu mượn thành công', 'success');
      fetchAll();
    } catch (err) {
      toast?.showToast(err.message || 'Không thể tạo phiếu mượn', 'error');
    }
  };

  const handleConfirmReturn = async (phieu) => {
    try {
      await phieuMuonApi.traSach(phieu.maPhieu);
      setReturningPhieu(null);
      toast?.showToast('Đã xác nhận trả sách', 'success');
      fetchAll();
    } catch (err) {
      toast?.showToast(err.message || 'Không thể trả sách', 'error');
    }
  };

  const handleDelete = async (phieu) => {
    if (!window.confirm(`Xóa phiếu mượn ${phieu.maPhieu}?`)) return;
    try {
      await phieuMuonApi.remove(phieu.maPhieu);
      toast?.showToast('Đã xóa phiếu mượn', 'success');
      fetchAll();
    } catch (err) {
      toast?.showToast(err.message || 'Không thể xóa phiếu mượn', 'error');
    }
  };

  return (
    <div className="page-card">
      <div className="page-card-header">
        <h2>Quản lý mượn / trả sách</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Tạo phiếu mượn
        </button>
      </div>

      <div className="tabs-row">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={"tab-item" + (activeTab === tab.key ? " active" : "")}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <div className="filter-field" style={{ minWidth: 280 }}>
          <label>Tìm kiếm</label>
          <input
            placeholder="Tìm theo mã phiếu, mã độc giả, mã sách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label>Từ ngày</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="filter-field">
          <label>Đến ngày</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Độc giả</th>
              <th>Sách</th>
              <th>Ngày mượn</th>
              <th>Ngày hẹn trả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="empty-state">Đang tải dữ liệu...</td>
              </tr>
            ) : filteredPhieus.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">Không có phiếu mượn nào phù hợp</td>
              </tr>
            ) : (
              filteredPhieus.map((p) => (
                <tr key={p.maPhieu}>
                  <td>{p.maPhieu}</td>
                  <td>{readerMap[p.maDocGia] ? `${readerMap[p.maDocGia]} (${p.maDocGia})` : p.maDocGia}</td>
                  <td>{bookMap[p.maSach] ? `${bookMap[p.maSach]} (${p.maSach})` : p.maSach}</td>
                  <td>{p.ngayMuon ? String(p.ngayMuon).slice(0, 10) : "-"}</td>
                  <td>{p.ngayHenTra ? String(p.ngayHenTra).slice(0, 10) : "-"}</td>
                  <td>
                    <StatusBadge status={p.displayStatus} />
                  </td>
                  <td>
                    <div className="table-actions">
                      {p.displayStatus !== "Da tra" && (
                        <button
                          className="btn btn-link-text btn-sm"
                          onClick={() => setReturningPhieu(p)}
                        >
                          Trả sách
                        </button>
                      )}
                      <button className="btn btn-danger-text btn-sm" onClick={() => handleDelete(p)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <BorrowFormModal
          readers={readers}
          books={books}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}
      {returningPhieu && (
        <ReturnBookModal
          phieu={returningPhieu}
          onClose={() => setReturningPhieu(null)}
          onConfirm={handleConfirmReturn}
        />
      )}
    </div>
  );
}

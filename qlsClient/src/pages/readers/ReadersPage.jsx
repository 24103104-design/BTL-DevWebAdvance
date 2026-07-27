import { useEffect, useMemo, useState } from "react";
import docGiaApi from "../../api/docGiaApi";
import ReaderFormModal from "../../components/readers/ReaderFormModal";
import { useToast } from "../../components/common/ToastProvider.jsx";
import "../../styles/dashboard-ui.css";

export default function ReadersPage() {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState(null); // null | { mode: 'create' } | { mode: 'edit', data }
  const toast = useToast();

  const fetchReaders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await docGiaApi.getAll();
      setReaders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch dữ liệu khi mount, pattern chuẩn không dùng lib fetching riêng
    fetchReaders();
  }, []);

  const filteredReaders = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return readers;
    return readers.filter(
      (r) =>
        r.maDocGia?.toLowerCase().includes(keyword) ||
        r.hoTen?.toLowerCase().includes(keyword) ||
        r.email?.toLowerCase().includes(keyword) ||
        r.soDienThoai?.toLowerCase().includes(keyword),
    );
  }, [readers, search]);

  const handleCreateSubmit = async (form) => {
    try {
      await docGiaApi.create(form);
      setModalState(null);
      toast?.showToast('Thêm độc giả thành công', 'success');
      fetchReaders();
    } catch (err) {
      toast?.showToast(err.message || 'Không thể thêm độc giả', 'error');
    }
  };

  const handleEditSubmit = async (form) => {
    const { maDocGia, ...rest } = form;
    try {
      await docGiaApi.update(maDocGia, rest);
      setModalState(null);
      toast?.showToast('Cập nhật độc giả thành công', 'success');
      fetchReaders();
    } catch (err) {
      toast?.showToast(err.message || 'Không thể cập nhật độc giả', 'error');
    }
  };

  const handleDelete = async (reader) => {
    if (!window.confirm(`Xóa độc giả ${reader.hoTen} (${reader.maDocGia})?`)) return;
    try {
      await docGiaApi.remove(reader.maDocGia);
      toast?.showToast('Đã xóa độc giả thành công', 'success');
      fetchReaders();
    } catch (err) {
      toast?.showToast(err.message || 'Không thể xóa độc giả', 'error');
    }
  };

  return (
    <div className="page-card">
      <div className="page-card-header">
        <h2>Danh sách độc giả</h2>
        <button className="btn btn-primary" onClick={() => setModalState({ mode: "create" })}>
          + Thêm độc giả
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-field" style={{ minWidth: 260 }}>
          <label>Tìm kiếm</label>
          <input
            placeholder="Tìm theo mã, họ tên, SĐT, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã độc giả</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="empty-state">Đang tải dữ liệu...</td>
              </tr>
            ) : filteredReaders.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">Chưa có độc giả nào, hãy thêm độc giả đầu tiên</td>
              </tr>
            ) : (
              filteredReaders.map((r) => (
                <tr key={r.maDocGia}>
                  <td>{r.maDocGia}</td>
                  <td>{r.hoTen}</td>
                  <td>{r.ngaySinh ? String(r.ngaySinh).slice(0, 10) : "-"}</td>
                  <td>{r.soDienThoai || "-"}</td>
                  <td>{r.email || "-"}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-link-text btn-sm"
                        onClick={() => setModalState({ mode: "edit", data: r })}
                      >
                        Sửa
                      </button>
                      <button className="btn btn-danger-text btn-sm" onClick={() => handleDelete(r)}>
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

      {modalState?.mode === "create" && (
        <ReaderFormModal onClose={() => setModalState(null)} onSubmit={handleCreateSubmit} />
      )}
      {modalState?.mode === "edit" && (
        <ReaderFormModal
          initialData={modalState.data}
          onClose={() => setModalState(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}

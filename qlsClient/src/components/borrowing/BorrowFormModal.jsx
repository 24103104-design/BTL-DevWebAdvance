import { useState } from "react";
import Modal from "../common/Modal";

const today = () => new Date().toISOString().slice(0, 10);

export default function BorrowFormModal({ readers, books, onClose, onSubmit }) {
  const [form, setForm] = useState({
    maPhieu: "",
    maDocGia: "",
    maSach: "",
    ngayMuon: today(),
    ngayHenTra: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const selectedBook = books.find((b) => b.maSach === form.maSach);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.maPhieu.trim()) next.maPhieu = "Vui lòng nhập mã phiếu";
    if (!form.maDocGia) next.maDocGia = "Vui lòng chọn độc giả";
    if (!form.maSach) next.maSach = "Vui lòng chọn sách";
    if (selectedBook?.soLuong <= 0) {
      next.maSach = "Sách đã hết, vui lòng chọn sách khác";
    }
    if (!form.ngayMuon) next.ngayMuon = "Vui lòng chọn ngày mượn";
    if (form.ngayHenTra && form.ngayHenTra < form.ngayMuon) {
      next.ngayHenTra = "Ngày hẹn trả phải sau ngày mượn";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, trangThai: "Dang muon" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Tạo phiếu mượn" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Mã phiếu</label>
          <input value={form.maPhieu} onChange={handleChange("maPhieu")} placeholder="VD: PM001" />
          {errors.maPhieu && <span className="form-error">{errors.maPhieu}</span>}
        </div>

        <div className="form-row">
          <label>Độc giả</label>
          <select value={form.maDocGia} onChange={handleChange("maDocGia")}>
            <option value="">-- Chọn độc giả --</option>
            {readers.map((r) => (
              <option key={r.maDocGia} value={r.maDocGia}>
                {r.maDocGia} - {r.hoTen}
              </option>
            ))}
          </select>
          {errors.maDocGia && <span className="form-error">{errors.maDocGia}</span>}
        </div>

        <div className="form-row">
          <label>Sách</label>
          <select value={form.maSach} onChange={handleChange("maSach")}>
            <option value="">-- Chọn sách --</option>
            {books.map((b) => (
              <option key={b.maSach} value={b.maSach} disabled={b.soLuong <= 0}>
                {b.maSach} - {b.tenSach} {b.soLuong <= 0 ? '(Đã hết)' : ''}
              </option>
            ))}
          </select>
          {errors.maSach && <span className="form-error">{errors.maSach}</span>}
          {selectedBook?.soLuong <= 0 && !errors.maSach && (
            <span className="form-error">Sách đã hết, vui lòng chọn sách khác</span>
          )}
        </div>

        <div className="form-row">
          <label>Ngày mượn</label>
          <input type="date" value={form.ngayMuon} onChange={handleChange("ngayMuon")} />
          {errors.ngayMuon && <span className="form-error">{errors.ngayMuon}</span>}
        </div>

        <div className="form-row">
          <label>Ngày hẹn trả</label>
          <input type="date" value={form.ngayHenTra} onChange={handleChange("ngayHenTra")} />
          {errors.ngayHenTra && <span className="form-error">{errors.ngayHenTra}</span>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting || selectedBook?.soLuong <= 0}>
            {submitting ? "Đang lưu..." : "Tạo phiếu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

import { useState } from "react";
import Modal from "../common/Modal";

const EMPTY_FORM = {
  maDocGia: "",
  hoTen: "",
  ngaySinh: "",
  soDienThoai: "",
  email: "",
};

export default function ReaderFormModal({ initialData, onClose, onSubmit }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(
    initialData
      ? {
          maDocGia: initialData.maDocGia,
          hoTen: initialData.hoTen || "",
          ngaySinh: initialData.ngaySinh
            ? String(initialData.ngaySinh).slice(0, 10)
            : "",
          soDienThoai: initialData.soDienThoai || "",
          email: initialData.email || "",
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.maDocGia.trim()) next.maDocGia = "Vui lòng nhập mã độc giả";
    if (!form.hoTen.trim()) next.hoTen = "Vui lòng nhập họ tên";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Email không hợp lệ";
    }
    if (form.soDienThoai && !/^[0-9]{9,15}$/.test(form.soDienThoai)) {
      next.soDienThoai = "Số điện thoại không hợp lệ";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form, isEdit);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? "Sửa thông tin độc giả" : "Thêm độc giả"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Mã độc giả</label>
          <input
            value={form.maDocGia}
            onChange={handleChange("maDocGia")}
            disabled={isEdit}
            placeholder="VD: DG001"
          />
          {errors.maDocGia && <span className="form-error">{errors.maDocGia}</span>}
        </div>

        <div className="form-row">
          <label>Họ tên</label>
          <input value={form.hoTen} onChange={handleChange("hoTen")} placeholder="Nguyễn Văn A" />
          {errors.hoTen && <span className="form-error">{errors.hoTen}</span>}
        </div>

        <div className="form-row">
          <label>Ngày sinh</label>
          <input type="date" value={form.ngaySinh} onChange={handleChange("ngaySinh")} />
        </div>

        <div className="form-row">
          <label>Số điện thoại</label>
          <input value={form.soDienThoai} onChange={handleChange("soDienThoai")} placeholder="0987654321" />
          {errors.soDienThoai && <span className="form-error">{errors.soDienThoai}</span>}
        </div>

        <div className="form-row">
          <label>Email</label>
          <input value={form.email} onChange={handleChange("email")} placeholder="email@example.com" />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

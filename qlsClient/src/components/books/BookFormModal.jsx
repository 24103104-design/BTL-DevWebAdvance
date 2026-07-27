import { useState } from 'react';
import Modal from '../common/Modal';

const EMPTY = { maSach: '', tenSach: '', tacGia: '', nhaXuatBan: '', namXuatBan: '', soLuong: 0 };

export default function BookFormModal({ initialData, onClose, onSubmit }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(initialData ? { ...initialData } : EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.maSach?.toString().trim()) next.maSach = 'Vui lòng nhập mã sách';
    if (!form.tenSach?.toString().trim()) next.tenSach = 'Vui lòng nhập tên sách';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEdit ? 'Sửa sách' : 'Thêm sách'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Mã sách</label>
          <input value={form.maSach} onChange={handleChange('maSach')} disabled={isEdit} />
          {errors.maSach && <span className="form-error">{errors.maSach}</span>}
        </div>
        <div className="form-row">
          <label>Tên sách</label>
          <input value={form.tenSach} onChange={handleChange('tenSach')} />
          {errors.tenSach && <span className="form-error">{errors.tenSach}</span>}
        </div>
        <div className="form-row">
          <label>Tác giả</label>
          <input value={form.tacGia} onChange={handleChange('tacGia')} />
        </div>
        <div className="form-row">
          <label>NXB</label>
          <input value={form.nhaXuatBan} onChange={handleChange('nhaXuatBan')} />
        </div>
        <div className="form-row">
          <label>Năm XB</label>
          <input type="number" value={form.namXuatBan || ''} onChange={handleChange('namXuatBan')} />
        </div>
        <div className="form-row">
          <label>Số lượng</label>
          <input type="number" value={form.soLuong ?? 0} onChange={handleChange('soLuong')} />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </Modal>
  );
}

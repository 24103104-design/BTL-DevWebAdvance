import { useState, useRef } from 'react';
import Modal from '../common/Modal';
import { resolveImageUrl } from '../../utils/urlHelpers.js';

const EMPTY = { maSach: '', tenSach: '', tacGia: '', nhaXuatBan: '', namXuatBan: '', soLuong: 0, anhBia: '' };

export default function BookFormModal({ initialData, onClose, onSubmit }) {
  const isEdit = Boolean(initialData);
  const [form, setForm] = useState(initialData ? { ...initialData } : EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(initialData?.anhBia || '');
  const [coverFile, setCoverFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.maSach?.toString().trim()) next.maSach = 'Vui lòng nhập mã sách';
    if (!form.tenSach?.toString().trim()) next.tenSach = 'Vui lòng nhập tên sách';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      const message = 'Kích thước ảnh không được vượt quá 5MB';
      setErrors((prev) => ({ ...prev, anhBia: message }));
      setCoverFile(null);
      setPreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.anhBia;
      return next;
    });
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setPreview(typeof result === 'string' ? result : '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append('maSach', form.maSach);
    formData.append('tenSach', form.tenSach);
    if (form.tacGia) formData.append('tacGia', form.tacGia);
    if (form.nhaXuatBan) formData.append('nhaXuatBan', form.nhaXuatBan);
    if (form.namXuatBan !== undefined && form.namXuatBan !== null && form.namXuatBan !== '') {
      formData.append('namXuatBan', String(form.namXuatBan));
    }
    formData.append('soLuong', String(form.soLuong ?? 0));
    if (coverFile) {
      formData.append('anhBia', coverFile);
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Book submit error:', error.response?.data || error.message || error);
      throw error;
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
        <div className="form-row">
          <label>Ảnh bìa sách</label>
          <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
          {errors.anhBia && <span className="form-error">{errors.anhBia}</span>}
          {preview ? (
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
              <img
                src={resolveImageUrl(preview) || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="110"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364768b" font-size="12">No image</text></svg>'}
                alt="Preview bìa sách"
                className="preview-book-image"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="110"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364768b" font-size="12">No image</text></svg>'; }}
              />
            </div>
          ) : (
            <div style={{ marginTop: 8, color: '#64748b' }}>Chưa chọn ảnh</div>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Hủy</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </Modal>
  );
}

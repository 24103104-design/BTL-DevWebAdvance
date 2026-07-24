import { useState } from "react";
import Modal from "../common/Modal";

export default function ReturnBookModal({ phieu, onClose, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(phieu);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Xác nhận trả sách" onClose={onClose} width={420}>
      <p style={{ fontSize: 13, color: "#3a415c", lineHeight: 1.6 }}>
        Xác nhận độc giả <strong>{phieu.maDocGia}</strong> trả sách{" "}
        <strong>{phieu.maSach}</strong> thuộc phiếu mượn{" "}
        <strong>{phieu.maPhieu}</strong>?
      </p>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Hủy
        </button>
        <button className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Xác nhận trả sách"}
        </button>
      </div>
    </Modal>
  );
}

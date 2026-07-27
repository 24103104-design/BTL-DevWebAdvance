import { useEffect, useState } from 'react';
import { getBorrows } from '../services/borrowService.js';

export default function Borrowing() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBorrows() {
      try {
        const response = await getBorrows();
        setBorrows(response.data);
      } catch (err) {
        setError('Không tải được dữ liệu phiếu mượn.');
      } finally {
        setLoading(false);
      }
    }

    fetchBorrows();
  }, []);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Phiếu mượn</h2>
          <p>Danh sách phiếu mượn đang hoạt động.</p>
        </div>
        <button className="btn btn-primary">Tạo phiếu mượn</button>
      </div>

      {loading ? (
        <div className="page-loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="page-error">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Mã độc giả</th>
                <th>Mã sách</th>
                <th>Ngày mượn</th>
                <th>Hẹn trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow.maPhieu}>
                  <td>{borrow.maPhieu}</td>
                  <td>{borrow.maDocGia}</td>
                  <td>{borrow.maSach}</td>
                  <td>{borrow.ngayMuon ? new Date(borrow.ngayMuon).toLocaleDateString() : 'N/A'}</td>
                  <td>{borrow.ngayHenTra ? new Date(borrow.ngayHenTra).toLocaleDateString() : 'Chưa có'}</td>
                  <td>{borrow.trangThai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

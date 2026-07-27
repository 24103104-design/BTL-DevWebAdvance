import { useEffect, useState } from 'react';
import { getReaders } from '../services/readerService.js';

export default function Readers() {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReaders() {
      try {
        const response = await getReaders();
        setReaders(response.data);
      } catch (err) {
        setError('Không tải được dữ liệu độc giả.');
      } finally {
        setLoading(false);
      }
    }

    fetchReaders();
  }, []);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Quản lý độc giả</h2>
          <p>Danh sách độc giả đăng ký sử dụng thư viện.</p>
        </div>
        <button className="btn btn-primary">Thêm độc giả</button>
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
                <th>Mã độc giả</th>
                <th>Họ tên</th>
                <th>Ngày sinh</th>
                <th>Điện thoại</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {readers.map((reader) => (
                <tr key={reader.maDocGia}>
                  <td>{reader.maDocGia}</td>
                  <td>{reader.hoTen}</td>
                  <td>{reader.ngaySinh ? new Date(reader.ngaySinh).toLocaleDateString() : 'N/A'}</td>
                  <td>{reader.soDienThoai || 'N/A'}</td>
                  <td>{reader.email || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

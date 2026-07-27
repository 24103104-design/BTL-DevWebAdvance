import { useEffect, useState } from 'react';
import { getBooks } from '../services/bookService.js';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (err) {
        setError('Không tải được dữ liệu sách.');
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2>Quản lý sách</h2>
          <p>Danh sách sách hiện tại trong hệ thống.</p>
        </div>
        <button className="btn btn-primary">Thêm sách</button>
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
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>NXB</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.maSach}>
                  <td>{book.maSach}</td>
                  <td>{book.tenSach}</td>
                  <td>{book.tacGia || 'N/A'}</td>
                  <td>{book.nhaXuatBan || 'N/A'}</td>
                  <td>{book.soLuong}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

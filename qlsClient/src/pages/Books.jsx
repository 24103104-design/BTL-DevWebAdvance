import { useEffect, useMemo, useState } from 'react';
import { getBooks, createBook, updateBook, removeBook } from '../services/bookService.js';
import BookFormModal from '../components/books/BookFormModal';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await getBooks(search);
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
        <div>
          <input
            placeholder="Tìm sách theo mã/tiêu đề/tác giả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button className="btn btn-outline-secondary" onClick={() => setLoading(true)}>
            Tìm
          </button>
          <button className="btn btn-primary" onClick={() => setModalState({ mode: 'create' })} style={{ marginLeft: 8 }}>
            Thêm sách
          </button>
        </div>
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
                  <td>
                    <button className="btn btn-link-text btn-sm" onClick={() => setModalState({ mode: 'edit', data: book })}>
                      Sửa
                    </button>
                    <button className="btn btn-danger-text btn-sm" onClick={async () => { if (!confirm('Xóa sách này?')) return; await removeBook(book.maSach); setLoading(true); }}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        {modalState?.mode === 'create' && (
          <BookFormModal
            onClose={() => setModalState(null)}
            onSubmit={async (form) => {
              await createBook(form);
              setModalState(null);
              setLoading(true);
            }}
          />
        )}
        {modalState?.mode === 'edit' && (
          <BookFormModal
            initialData={modalState.data}
            onClose={() => setModalState(null)}
            onSubmit={async (form) => {
              await updateBook(form.maSach, form);
              setModalState(null);
              setLoading(true);
            }}
          />
        )}
    </div>
  );
}

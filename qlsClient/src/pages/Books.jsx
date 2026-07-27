import { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, removeBook } from '../services/bookService.js';
import BookFormModal from '../components/books/BookFormModal';
import { useToast } from '../components/common/ToastProvider.jsx';
import { resolveImageUrl } from '../utils/urlHelpers.js';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState(null);
  const toast = useToast();

  const fetchBooks = async (keyword = search) => {
    setLoading(true);
    setError('');
    try {
      const response = await getBooks(keyword);
      const nextBooks = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      if (!Array.isArray(nextBooks)) {
        throw new Error('Dữ liệu sách không hợp lệ');
      }

      setBooks(nextBooks);
    } catch (err) {
      const message = err?.message || 'Không tải được dữ liệu sách.';
      setError(message);
      toast?.showToast(message, 'error');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(search);
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
          <button className="btn btn-outline-secondary" onClick={() => fetchBooks(search)}>
            Tìm
          </button>
          <button className="btn btn-primary" onClick={() => setModalState({ mode: 'create' })} style={{ marginLeft: 8 }}>
            Thêm sách
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state-card">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="empty-state-card">{error}</div>
      ) : !Array.isArray(books) || books.length === 0 ? (
        <div className="empty-state-card">
          <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
          <h5>Chưa có sách nào, hãy thêm sách đầu tiên</h5>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>NXB</th>
                <th>Số lượng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(books) ? books : []).map((book) => {
                const safeBook = book || {};
                const imgSrc = resolveImageUrl(safeBook.anhBia);
                const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="70"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364768b" font-size="10">No image</text></svg>';

                return (
                  <tr key={safeBook.maSach || safeBook.id || Math.random()}>
                    <td>
                      <img
                        src={imgSrc || placeholder}
                        alt={safeBook.tenSach || 'Bìa sách'}
                        className="table-book-image"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder; }}
                      />
                    </td>
                    <td>{safeBook.maSach ?? 'N/A'}</td>
                    <td>{safeBook.tenSach ?? 'N/A'}</td>
                    <td>{safeBook.tacGia || 'N/A'}</td>
                    <td>{safeBook.nhaXuatBan || 'N/A'}</td>
                    <td>{safeBook.soLuong ?? '0'}</td>
                    <td>
                      <button className="btn btn-link-text btn-sm" onClick={() => setModalState({ mode: 'edit', data: safeBook })}>
                        Sửa
                      </button>
                      <button className="btn btn-danger-text btn-sm" onClick={async () => {
                        if (!window.confirm('Xóa sách này?')) return;
                        try {
                          await removeBook(safeBook.maSach);
                          toast?.showToast('Đã xóa sách thành công', 'success');
                          fetchBooks(search);
                        } catch (err) {
                          const message = err.response?.data?.message || err.message || 'Không thể xóa sách';
                          toast?.showToast(message, 'error');
                        }
                      }}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
        {modalState?.mode === 'create' && (
          <BookFormModal
            onClose={() => setModalState(null)}
            onSubmit={async (form) => {
              try {
                await createBook(form);
                setModalState(null);
                toast?.showToast('Thêm sách thành công', 'success');
                fetchBooks(search);
              } catch (err) {
                const message = err.response?.data?.message || err.message || 'Không thể thêm sách';
                console.error('Create book error:', err.response?.data || err.message || err);
                toast?.showToast(message, 'error');
              }
            }}
          />
        )}
        {modalState?.mode === 'edit' && (
          <BookFormModal
            initialData={modalState.data}
            onClose={() => setModalState(null)}
            onSubmit={async (form) => {
              try {
                const isFormData = form instanceof FormData;
                const id = isFormData ? form.get('maSach') : form.maSach;
                if (!id) throw new Error('Thiếu mã sách để cập nhật');
                await updateBook(id, form);
                setModalState(null);
                toast?.showToast('Cập nhật sách thành công', 'success');
                fetchBooks(search);
              } catch (err) {
                const message = err.response?.data?.message || err.message || 'Không thể cập nhật sách';
                console.error('Update book error:', err.response?.data || err.message || err);
                toast?.showToast(message, 'error');
              }
            }}
          />
        )}
    </div>
  );
}

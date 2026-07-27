import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { resolveImageUrl } from '../utils/urlHelpers.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [overdues, setOverdues] = useState([]);

  const normalizeStatus = (status) => {
    const value = String(status || '').trim();
    switch (value.toLowerCase()) {
      case 'dang muon':
        return 'Đang mượn';
      case 'da tra':
        return 'Đã trả';
      case 'qua han':
        return 'Quá hạn';
      default:
        return value || 'Không rõ';
    }
  };

  const getStatusBadgeClass = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === 'Đang mượn') return 'status-badge status-borrowing';
    if (normalized === 'Đã trả') return 'status-badge status-returned';
    if (normalized === 'Quá hạn') return 'status-badge status-overdue';
    return 'status-badge';
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        const [summaryRes, recentRes, topRes, overduesRes] = await Promise.all([
          axiosClient.get('/dashboard/summary'),
          axiosClient.get('/dashboard/recent-activity'),
          axiosClient.get('/dashboard/top-books'),
          axiosClient.get('/dashboard/overdues'),
        ]);

        setStats(summaryRes);
        setRecent(recentRes || []);
        setTopBooks(topRes || []);
        setOverdues(overduesRes || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const cards = [
    { label: 'Tổng số sách', value: stats?.totalBooks ?? 0, icon: '📚' },
    { label: 'Tổng số độc giả', value: stats?.totalReaders ?? 0, icon: '👤' },
    { label: 'Số phiếu đang hoạt động', value: stats?.activeBorrows ?? 0, icon: '📝' },
    { label: 'Số phiếu quá hạn', value: stats?.overdueBorrows ?? 0, icon: '⚠️' },
  ];

  return (
    <div className="dashboard-page">
      <div className="stats-grid">
        {cards.map((card) => (
          <div className="stat-card" key={card.label} style={{ borderLeftColor: card.label.includes('quá hạn') && card.value > 0 ? '#f97316' : undefined }}>
            <div className="stat-icon">{card.icon}</div>
            <div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{loading ? '…' : card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity + Top books + Overdue alerts */}
      <div className="dashboard-grid">
        <div className="page-card">
          <h3>Hoạt động gần đây</h3>
          {loading ? (
            <p>Đang tải...</p>
          ) : recent.length === 0 ? (
            <p>Chưa có hoạt động</p>
          ) : (
            <table className="table dashboard-table">
              <thead>
                <tr>
                  <th>Độc giả</th>
                  <th>Sách</th>
                  <th>Ngày mượn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.maPhieu}>
                    <td>
                      <span className="text-ellipsis">{r.hoTen || r.maDocGia}</span>
                    </td>
                    <td>
                      <span className="text-ellipsis">{r.tenSach || r.maSach}</span>
                    </td>
                    <td>{r.ngayMuon ? new Date(r.ngayMuon).toLocaleDateString() : ''}</td>
                    <td>
                      <span className={getStatusBadgeClass(r.trangThai)}>{normalizeStatus(r.trangThai)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="page-card">
          <h3>Sách được mượn nhiều nhất</h3>
          {loading ? (
            <p>Đang tải...</p>
          ) : topBooks.length === 0 ? (
            <p>Không có dữ liệu</p>
          ) : (
            <div className="top-books">
              {topBooks.map((b) => {
                const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="80"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2364768b" font-size="12">No image</text></svg>';
                const imgSrc = resolveImageUrl(b.anhBia) || placeholder;
                return (
                  <div className="top-book-card" key={b.maSach || `${b.tenSach}-${b.borrowCount}`}>
                    <img
                      src={imgSrc}
                      alt={b.tenSach}
                      className="top-book-image"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = placeholder;
                      }}
                    />
                    <div className="top-book-info">
                      <div className="top-book-title">{b.tenSach || 'Không rõ tên sách'}</div>
                      <div className="top-book-author">{b.tacGia || 'Không rõ tác giả'}</div>
                      <div className="top-book-count"><span>Lượt mượn: {b.borrowCount ?? 0}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {overdues && overdues.length > 0 && (
            <div className="overdue-alert">
              <div className="overdue-header">⚠️ Cảnh báo - Phiếu quá hạn</div>
              <ul>
                {overdues.map((o) => (
                  <li key={o.maPhieu}>
                    <strong>{o.hoTen}</strong> - {o.tenSach} - Hạn: {o.ngayHenTra ? new Date(o.ngayHenTra).toLocaleDateString() : ''} - Trễ {o.daysLate} ngày
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

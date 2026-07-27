import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { FiHome, FiBookOpen, FiUsers, FiClipboard, FiBarChart2, FiBell, FiLogOut, FiUser, FiChevronDown, FiCamera } from 'react-icons/fi';
import './App.css';
import './styles/statistics.css';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Statistics from './pages/Statistics.jsx';
import Books from './pages/Books.jsx';
import ReadersPage from './pages/readers/ReadersPage.jsx';
import BorrowingPage from './pages/borrowing/BorrowingPage.jsx';
import ProfilePage from './pages/Profile.jsx';
import { ToastProvider } from './components/common/ToastProvider.jsx';
import { getProfile, uploadAvatar } from './services/authService.js';
import { resolveAvatar } from './utils/urlHelpers.js';

function RequireAuth({ token, children }) {
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return JSON.parse(decodeURIComponent(decoded.split('').map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`).join('')));
  } catch {
    return null;
  }
}

function ProtectedLayout({ token, user, onLogout, onUserUpdated }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatarUrl || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setPreviewAvatar(user?.avatarUrl || '');
  }, [user?.avatarUrl]);

  const handleAvatarImgError = (e) => {
    e.currentTarget.onerror = null;
    setPreviewAvatar('');
  };

  const displayName = user?.fullName || user?.username || 'Người dùng';
  const initials = (displayName || 'U').split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewAvatar(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const response = await uploadAvatar(token, file);
      const nextUser = {
        ...(user || {}),
        ...response.data?.user,
        avatarUrl: response.data?.avatarUrl || response.data?.user?.avatarUrl || null,
      };
      onUserUpdated(nextUser);
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể cập nhật ảnh đại diện';
      window.alert(message);
    } finally {
      setUploading(false);
    }
  };

  // --- Search logic ---
  const menuItems = [
    { label: 'Trang chủ', path: '/dashboard' },
    { label: 'Quản lý sách', path: '/books' },
    { label: 'Quản lý độc giả', path: '/readers' },
    { label: 'Phiếu mượn', path: '/borrowing' },
    { label: 'Thống kê', path: '/statistics' },
  ];

  const normalizeText = (s = '') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const findNormalizedMatch = (original, query) => {
    const norm = normalizeText(original);
    const q = normalizeText(query);
    if (!q) return null;
    const idx = norm.indexOf(q);
    if (idx === -1) return null;

    // map normalized index back to original string index
    const map = [];
    let ni = 0;
    for (let i = 0; i < original.length; i++) {
      const ch = original[i];
      const n = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      for (let k = 0; k < n.length; k++) {
        map[ni++] = i;
      }
    }
    const startOrig = map[idx];
    const endNormIndex = idx + q.length - 1;
    const endOrig = map[endNormIndex] + 1;
    return { start: startOrig, end: endOrig };
  };

  const highlightLabel = (label, query) => {
    const match = findNormalizedMatch(label, query);
    if (!match) return label;
    return (
      <>
        {label.slice(0, match.start)}
        <span className="search-highlight">{label.slice(match.start, match.end)}</span>
        {label.slice(match.end)}
      </>
    );
  };

  const filtered = searchTerm
    ? menuItems.filter((m) => normalizeText(m.label).includes(normalizeText(searchTerm)))
    : [];

  const handleSearchSelect = (item) => {
    setSearchTerm('');
    setShowSearch(false);
    navigate(item.path);
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-logo">
          <div className="brand-mark">LP</div>
          <div>
            <strong>Library</strong>
            <span>Phenikaa</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link">
            <span className="sidebar-icon sidebar-icon-home"><FiHome /></span>
            Trang chủ
          </NavLink>
          <NavLink to="/books" className="sidebar-link">
            <span className="sidebar-icon sidebar-icon-books"><FiBookOpen /></span>
            Quản lý sách
          </NavLink>
          <NavLink to="/readers" className="sidebar-link">
            <span className="sidebar-icon sidebar-icon-users"><FiUsers /></span>
            Quản lý độc giả
          </NavLink>
          <NavLink to="/borrowing" className="sidebar-link">
            <span className="sidebar-icon sidebar-icon-borrow"><FiClipboard /></span>
            Phiếu mượn
          </NavLink>
          <NavLink to="/statistics" className="sidebar-link">
            <span className="sidebar-icon sidebar-icon-stats"><FiBarChart2 /></span>
            Thống kê
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>Hệ thống quản lý thư viện</p>
          <small>Phenikaa University</small>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-search input-group">
            <input
              type="search"
              className="form-control"
              placeholder="Tìm kiếm chức năng..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 150)}
            />
            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowSearch((s) => !s)}>
              Tìm kiếm
            </button>

            {showSearch && (
              <div className="search-results">
                {filtered.length === 0 ? (
                  <div className="search-empty">Không tìm thấy chức năng</div>
                ) : (
                  filtered.map((item) => (
                    <button key={item.path} className="search-item" onMouseDown={() => handleSearchSelect(item)}>
                      {highlightLabel(item.label, searchTerm)}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="topbar-actions">
            <div className="notification-pill" aria-label="Thông báo"><FiBell /></div>
            <div className="topbar-user" ref={menuRef}>
              <button type="button" className={`user-trigger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen((value) => !value)}>
                <div className="user-avatar-wrap">
                  {previewAvatar ? (
                    <img className="user-avatar-image" src={resolveAvatar(previewAvatar)} alt="Avatar" onError={handleAvatarImgError} />
                  ) : (
                    <div className="user-avatar">{initials}</div>
                  )}
                  <label className="avatar-upload-badge" title="Đổi ảnh đại diện">
                    <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleAvatarChange} hidden />
                    <FiCamera />
                  </label>
                </div>
                <div className="user-meta">
                  <span className="user-name">{displayName}</span>
                  <span className="user-role">{user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</span>
                </div>
                <span className="user-chevron"><FiChevronDown /></span>
              </button>

              <div className={`user-dropdown ${menuOpen ? 'open' : ''}`}>
                <div className="user-dropdown-header">
                  <div className="user-avatar-wrap user-avatar-wrap-lg">
                    {previewAvatar ? (
                      <img className="user-avatar-image user-avatar-image-lg" src={resolveAvatar(previewAvatar)} alt="Avatar" onError={handleAvatarImgError} />
                    ) : (
                      <div className="user-avatar user-avatar-lg">{initials}</div>
                    )}
                  </div>
                  <div>
                    <div className="dropdown-user-name">{displayName}</div>
                    <div className="dropdown-user-email">{user?.email || 'Chưa có email'}</div>
                  </div>
                </div>

                <NavLink to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <span className="dropdown-icon"><FiUser /></span>
                  Thông tin tài khoản
                </NavLink>

                <label className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <span className="dropdown-icon"><FiCamera /></span>
                  {uploading ? 'Đang tải ảnh...' : 'Đổi ảnh đại diện'}
                  <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleAvatarChange} hidden />
                </label>

                <button type="button" className="dropdown-item dropdown-item-logout" onClick={() => { setMenuOpen(false); onLogout(); }}>
                  <span className="dropdown-icon"><FiLogOut /></span>
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/books" element={<Books />} />
          <Route path="/readers" element={<ReadersPage />} />
          <Route path="/borrowing" element={<BorrowingPage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const storedToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('authUser');
  const [token, setToken] = useState(storedToken || '');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem('authUser');
      return;
    }

    const fallbackUser = decodeJwtPayload(token);
    if (fallbackUser) {
      const nextUser = {
        id: fallbackUser.sub || fallbackUser.id,
        username: fallbackUser.username || 'người dùng',
        email: fallbackUser.email || '',
        role: fallbackUser.role || 'user',
        avatarUrl: fallbackUser.avatarUrl || null,
        fullName: fallbackUser.fullName || fallbackUser.username || 'Người dùng',
      };
      setUser(nextUser);
      localStorage.setItem('authUser', JSON.stringify(nextUser));
    }

    getProfile(token)
      .then((response) => {
        const profileUser = response.data || response;
        const nextUser = {
          id: profileUser.id,
          username: profileUser.username || 'người dùng',
          email: profileUser.email || '',
          role: profileUser.role || 'user',
          avatarUrl: profileUser.avatarUrl || null,
          fullName: profileUser.fullName || profileUser.username || 'Người dùng',
        };
        setUser(nextUser);
        localStorage.setItem('authUser', JSON.stringify(nextUser));
      })
      .catch(() => {
        // giữ user đã sinh từ token nếu API profile lỗi
      });
  }, [token]);

  function handleLogin(newToken, newUser) {
    setToken(newToken);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('authUser', JSON.stringify(newUser));
    }
  }

  function handleLogout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('authUser');
  }

  function handleUserUpdated(nextUser) {
    setUser(nextUser);
    localStorage.setItem('authUser', JSON.stringify(nextUser));
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} token={token} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} token={token} />} />
          <Route
            path="/*"
            element={
              <RequireAuth token={token}>
                <ProtectedLayout token={token} user={user} onLogout={handleLogout} onUserUpdated={handleUserUpdated} />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

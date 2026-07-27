import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Books from './pages/Books.jsx';
import Readers from './pages/Readers.jsx';
import Borrowing from './pages/Borrowing.jsx';

function RequireAuth({ token, children }) {
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function ProtectedLayout({ token, onLogout }) {
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
            <span className="sidebar-icon">🏠</span>
            Trang chủ
          </NavLink>
          <NavLink to="/books" className="sidebar-link">
            <span className="sidebar-icon">📚</span>
            Quản lý sách
          </NavLink>
          <NavLink to="/readers" className="sidebar-link">
            <span className="sidebar-icon">👤</span>
            Quản lý độc giả
          </NavLink>
          <NavLink to="/borrowing" className="sidebar-link">
            <span className="sidebar-icon">📝</span>
            Phiếu mượn
          </NavLink>
          <NavLink to="/dashboard" className="sidebar-link">
            <span className="sidebar-icon">📊</span>
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
            <input type="search" className="form-control" placeholder="Tìm kiếm chức năng..." />
            <button className="btn btn-outline-secondary" type="button">
              Tìm kiếm
            </button>
          </div>
          <div className="topbar-user">
            <span className="user-name">Người dùng</span>
            <div className="user-avatar">GD</div>
            <button className="btn btn-outline-secondary btn-logout" onClick={onLogout}>
              Đăng xuất
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/readers" element={<Readers />} />
          <Route path="/borrowing" element={<Borrowing />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const storedToken = localStorage.getItem('authToken');
  const [token, setToken] = useState(storedToken || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  const authContext = useMemo(
    () => ({ token, setToken }),
    [token],
  );

  function handleLogin(newToken) {
    setToken(newToken);
  }

  function handleLogout() {
    setToken('');
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} token={token} />} />
        <Route
          path="/*"
          element={
            <RequireAuth token={token}>
              <ProtectedLayout token={token} onLogout={handleLogout} />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

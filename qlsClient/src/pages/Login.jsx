import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService.js';

export default function Login({ onLogin, token }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ username, password });
      const authToken = response.data.access_token;
      onLogin(authToken);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        <p>Đăng nhập để truy cập hệ thống quản lý thư viện.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Tên đăng nhập
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Nhập username"
              required
            />
          </label>

          <label>
            Mật khẩu
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Nhập password"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

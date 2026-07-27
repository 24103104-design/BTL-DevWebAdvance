import { useEffect, useMemo, useState } from 'react';
import { uploadAvatar } from '../services/authService.js';
import { resolveAvatar } from '../utils/urlHelpers.js';

export default function Profile({ user }) {
  const [uploading, setUploading] = useState(false);
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const displayName = useMemo(() => localUser?.fullName || localUser?.username || 'Chưa cập nhật', [localUser]);
  const initials = useMemo(() => (displayName || 'U').split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U', [displayName]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await uploadAvatar(token, file);
      const nextUser = {
        ...(localUser || {}),
        ...response.data?.user,
        avatarUrl: response.data?.avatarUrl || response.data?.user?.avatarUrl || null,
      };
      setLocalUser(nextUser);
      localStorage.setItem('authUser', JSON.stringify(nextUser));
    } catch (error) {
      window.alert(error?.response?.data?.message || 'Không thể cập nhật ảnh đại diện');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarImgError = (e) => {
    e.currentTarget.onerror = null;
    setLocalUser((prev) => ({ ...(prev || {}), avatarUrl: null }));
  };

  return (
    <div className="page-card">
      <h2>Thông tin tài khoản</h2>
      <div className="profile-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div className="user-avatar-wrap">
            {localUser?.avatarUrl ? (
              <img src={resolveAvatar(localUser.avatarUrl)} alt="Avatar" className="user-avatar-image" style={{ width: 72, height: 72 }} onError={handleAvatarImgError} />
            ) : (
              <div className="user-avatar" style={{ width: 72, height: 72, fontSize: 24 }}>{initials}</div>
            )}
              <label style={{ position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: '50%', background: '#f4772e', color: 'white', display: 'grid', placeItems: 'center', cursor: 'pointer', border: '2px solid white' }} title="Đổi ảnh đại diện">
              <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleAvatarChange} hidden />
              <span>📷</span>
            </label>
          </div>
          <div>
            <h4 style={{ margin: 0 }}>{displayName}</h4>
            <p style={{ margin: '4px 0 0', color: '#64748b' }}>{uploading ? 'Đang tải ảnh...' : 'Bạn có thể đổi ảnh đại diện tại đây.'}</p>
          </div>
        </div>
        <p><strong>Họ và tên:</strong> {displayName}</p>
        <p><strong>Email:</strong> {localUser?.email || 'Chưa cập nhật'}</p>
        <p><strong>Vai trò:</strong> {localUser?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
      </div>
    </div>
  );
}

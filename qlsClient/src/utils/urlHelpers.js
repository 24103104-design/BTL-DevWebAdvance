export const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export function resolveAvatar(u) {
  if (!u) return null;
  if (typeof u !== 'string') return null;
  if (u.startsWith('data:') || u.startsWith('http')) return u;
  const path = u.startsWith('/') ? u : `/${u}`;
  return `${API_BASE}${path}`;
}

export function resolveImageUrl(u) {
  if (!u) return null;
  if (typeof u !== 'string') return null;
  if (u.startsWith('data:') || u.startsWith('http')) return u;
  const path = u.startsWith('/') ? u : `/${u}`;
  return `${API_BASE}${path}`;
}

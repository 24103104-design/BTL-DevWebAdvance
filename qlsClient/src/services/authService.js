import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export function login(credentials) {
  return axios.post(`${API_BASE}/auth/login`, credentials);
}

export function register(credentials) {
  return axios.post(`${API_BASE}/auth/register`, credentials);
}

export function getProfile(token) {
  return axios.get(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function uploadAvatar(token, file) {
  const formData = new FormData();
  formData.append('file', file);

  return axios.patch(`${API_BASE}/users/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

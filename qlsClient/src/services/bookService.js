import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function getBooks(search = '') {
  const url = `${API_BASE}/sach${search ? `?search=${encodeURIComponent(search)}` : ''}`;
  return axios.get(url);
}

export function getBook(maSach) {
  return axios.get(`${API_BASE}/sach/${maSach}`);
}

export function createBook(data) {
  return axios.post(`${API_BASE}/sach`, data);
}

export function updateBook(maSach, data) {
  return axios.put(`${API_BASE}/sach/${maSach}`, data);
}

export function removeBook(maSach) {
  return axios.delete(`${API_BASE}/sach/${maSach}`);
}

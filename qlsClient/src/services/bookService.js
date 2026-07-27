import axiosClient from '../api/axiosClient.js';

export function getBooks(search = '') {
  const url = `/sach${search ? `?search=${encodeURIComponent(search)}` : ''}`;
  return axiosClient.get(url);
}

export function getBook(maSach) {
  return axiosClient.get(`/sach/${maSach}`);
}

export function createBook(data) {
  return axiosClient.post('/sach', data);
}

export function updateBook(maSach, data) {
  return axiosClient.put(`/sach/${maSach}`, data);
}

export function removeBook(maSach) {
  return axiosClient.delete(`/sach/${maSach}`);
}

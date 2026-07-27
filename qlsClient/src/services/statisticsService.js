import axiosClient from '../api/axiosClient.js';

export function getBorrowTrend({ period, startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  return axiosClient.get(`/statistics/borrow-trend?${params.toString()}`);
}

export function getBorrowByCategory() {
  return axiosClient.get('/statistics/by-category');
}

export function getBorrowStatus() {
  return axiosClient.get('/statistics/borrow-status');
}

export function getTopReaders() {
  return axiosClient.get('/statistics/top-readers');
}

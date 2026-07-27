import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export function getBorrows() {
  return axios.get(`${API_BASE}/phieu-muon`);
}

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export function getReaders() {
  return axios.get(`${API_BASE}/doc-gia`);
}

import axiosClient from "./axiosClient";

const phieuMuonApi = {
  getAll: () => axiosClient.get("/phieu-muon"),
  getOne: (maPhieu) => axiosClient.get(`/phieu-muon/${maPhieu}`),
  getByDocGia: (maDocGia) =>
    axiosClient.get(`/phieu-muon/doc-gia/${maDocGia}`), // lịch sử mượn của 1 độc giả
  create: (data) => axiosClient.post("/phieu-muon", data),
  update: (maPhieu, data) => axiosClient.put(`/phieu-muon/${maPhieu}`, data),
  remove: (maPhieu) => axiosClient.delete(`/phieu-muon/${maPhieu}`),
  traSach: (maPhieu) =>
  axiosClient.put(`/phieu-muon/${maPhieu}`, { trangThai: "Da tra" }),
};

export default phieuMuonApi;
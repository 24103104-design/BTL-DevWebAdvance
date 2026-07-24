import axiosClient from "./axiosClient";

const docGiaApi = {
  getAll: () => axiosClient.get("/doc-gia"),
  getOne: (maDocGia) => axiosClient.get(`/doc-gia/${maDocGia}`),
  create: (data) => axiosClient.post("/doc-gia", data),
  update: (maDocGia, data) => axiosClient.put(`/doc-gia/${maDocGia}`, data),
  remove: (maDocGia) => axiosClient.delete(`/doc-gia/${maDocGia}`),
};

export default docGiaApi;

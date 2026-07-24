import axiosClient from "./axiosClient";

const sachApi = {
  getAll: () => axiosClient.get("/sach"),
  getOne: (maSach) => axiosClient.get(`/sach/${maSach}`),
};

export default sachApi;

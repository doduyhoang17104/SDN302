import axiosInstance from "../api/axios";

export const getProfile = () => {
  return axiosInstance.get("/auth/me");
};

export const updateProfile = (data) => {
  return axiosInstance.put("/user/profile", data);
};

export const getAllUsers = () => {
  return axiosInstance.get("/user/list");
};

export const deleteUser = (id) => {
  return axiosInstance.delete(`/user/${id}`);
};

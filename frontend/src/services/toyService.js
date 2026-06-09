import axiosInstance from "@/api/axios";

export const getMyToys = () => {
  return axiosInstance.get("/toys/my");
};

export const createToy = (toy) => {
  return axiosInstance.post("/toys", toy);
};
export const editToy = (id, toy) => {
  return axiosInstance.put(`/toys/${id}`, toy);
}
export const deleteToy = (id) => {
  return axiosInstance.delete(`/toys/${id}`);
};
export const getAllToys = () => {
  return axiosInstance.get("/toys/getAll");
};
export const getToyOwner = (toyId) => {
  return axiosInstance.get(`/toys/${toyId}/owner`);
};
export const getToysByOwnerId = (ownerId) => {
  return axiosInstance.get(`/toys/owner/${ownerId}`);
};
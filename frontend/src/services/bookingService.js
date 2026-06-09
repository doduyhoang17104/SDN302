import axiosInstance from "@/api/axios";

// tạo booking
export const createBooking = (booking) => {
  return axiosInstance.post("/bookings", booking);
};

// lấy booking của user
export const getMyBookings = (userId) => {
  return axiosInstance.get(`/bookings/user/${userId}`);
};

// lấy booking của owner
export const getOwnerBookings = (ownerId) => {
  return axiosInstance.get(`/bookings/owner/${ownerId}`);
};

// update trạng thái booking
export const updateBookingStatus = (id, status) => {
  return axiosInstance.put(`/bookings/${id}/status`, { status });
};

// lấy chi tiết booking (cho trang trả đồ)
export const getBookingDetails = (id) => {
  return axiosInstance.get(`/bookings/${id}`);
};

// trả đồ chơi
export const returnToy = (bookingId, payload = {}) => {
  return axiosInstance.put(`/bookings/${bookingId}/return`, payload);
};
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMyBookings, updateBookingStatus } from "@/services/bookingService";
import { showSuccess, showError, showConfirm } from "@/components/alert";
/**
 * MyBookings Component
 * Handles the display of user's toy rental bookings.
 * Uses Tailwind CSS for styling and maintains consistency with ToyList UI.
 */
function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve user from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user._id);

  useEffect(() => {
    if (user && user._id) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings(user._id);
      // Ensure data is array before setting state
      const data = Array.isArray(res.data) ? res.data : [];
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get Tailwind classes based on status
  const getStatusBadgeStyles = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      waiting_refund: "bg-orange-100 text-orange-800 border-orange-200",
      returned: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return styles[status] || "bg-blue-100 text-blue-800 border-blue-200";
  };

  const translateStatus = (status) => {
    const map = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Bị từ chối",
      cancelled: "Đã hủy",
      waiting_refund: "Chờ hoàn lại tiền cọc",
      completed: "Đã hoàn thành",
    };
    return map[status] || status;
  };

  const handleCancelBooking = async (id) => {
    const isConfirm = await showConfirm(
      "Xác nhận hủy đơn?",
      "Bạn có chắc chắn muốn hủy đơn này không?",
      "Hủy đơn",
    );
    if (!isConfirm) return;

    try {
      await updateBookingStatus(id, "cancelled");
      fetchBookings();
      showSuccess("Đã hủy đơn thành công");
    } catch (error) {
      console.error(error);
      showError("Lỗi khi hủy đơn");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Đơn thuê của tôi
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Quản lý danh sách các đồ chơi bạn đã đặt thuê và theo dõi trạng
              thái đơn hàng.
            </p>
          </div>

          {/* Content Area */}
          {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-96 animate-pulse shadow-sm border border-slate-100"
                >
                  <div className="h-48 bg-slate-200 w-full mb-4"></div>
                  <div className="px-6 space-y-3">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                Bạn chưa có đơn thuê nào
              </h3>
              <p className="text-slate-500 mb-6">
                Hãy khám phá kho đồ chơi của chúng tôi để bắt đầu thuê ngay!
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-[#32d3d2] hover:bg-[#2bc0bf] text-white font-medium rounded-full transition-colors shadow-sm hover:shadow-md"
              >
                Khám phá đồ chơi
              </Link>
            </div>
          ) : (
            // Booking List (Horizontal rows)
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col md:flex-row group"
                >
                  {/* Image Section */}
                  <div className="relative w-full md:w-72 h-56 shrink-0 bg-slate-100">
                    <img
                      src={
                        booking.toyId?.image ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={booking.toyId?.name || "Toy Image"}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${getStatusBadgeStyles(booking.status)}`}
                      >
                        {translateStatus(booking.status)}
                      </span>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="p-6 flex-grow flex flex-col md:flex-row gap-6">
                    {/* Main Info */}
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-slate-800 line-clamp-2 group-hover:text-[#32d3d2] transition-colors">
                          {booking.toyId?.name || "Tên đồ chơi không xác định"}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                        <div className="flex flex-col space-y-1">
                          <span className="text-slate-400 text-xs uppercase">
                            Chủ đồ chơi
                          </span>
                          <span className="font-medium text-slate-700">
                            {booking.toyId?.owner?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-slate-400 text-xs uppercase">
                            Liên hệ
                          </span>
                          <span className="font-medium text-slate-700 font-mono">
                            {booking.toyId?.owner?.phone || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-slate-400 text-xs uppercase">
                            Ngày thuê
                          </span>
                          <span className="font-medium text-slate-700">
                            {new Date(booking.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-slate-400 text-xs uppercase">
                            Ngày trả
                          </span>
                          <span className="font-medium text-slate-700">
                            {booking.returnDate
                              ? new Date(booking.returnDate).toLocaleDateString(
                                  "vi-VN",
                                )
                              : "Chưa trả"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action & Pricing Side */}
                    <div className="flex flex-col justify-between shrink-0 md:w-64 md:border-l md:border-slate-100 md:pl-6 space-y-4 md:space-y-0 text-slate-600">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center md:flex-col md:items-end">
                          <span className="text-slate-400 text-xs uppercase mb-1">
                            Giá thuê
                          </span>
                          <span className="text-xl font-bold text-[#32d3d2]">
                            {booking.toyId?.price?.toLocaleString() || 0} đ
                            <span className="text-xs font-normal text-slate-400 ml-1">
                              / tuần
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center md:flex-col md:items-end">
                          <span className="text-slate-400 text-xs uppercase mb-1">
                            Tiền cọc
                          </span>
                          <span className="font-semibold text-slate-600">
                            {booking.deposit?.toLocaleString() ||
                              booking.toyId?.deposit?.toLocaleString() ||
                              0}{" "}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between items-center md:flex-col md:items-end">
                          <span className="text-slate-400 text-xs uppercase mb-1">
                            Tổng tiền cọc và ship
                          </span>
                          <span className="font-semibold text-[#32d3d2]">
                            {(
                              (booking.deposit || 0) +
                              (booking.shippingFee || 15000)
                            ).toLocaleString()}{" "}
                            đ
                          </span>
                        </div>

                        {(booking.status === "returned" ||
                          booking.status === "waiting_refund" ||
                          (booking.status === "completed" &&
                            booking.deposit > booking.price)) && (
                          <div className="flex justify-between items-center md:flex-col md:items-end">
                            <span className="text-slate-400 text-xs uppercase mb-1">
                              Tiền được hoàn
                            </span>
                            <span className="font-bold text-orange-500">
                              {Math.max(
                                0,
                                (booking.deposit || 0) - (booking.price || 0),
                              ).toLocaleString()}{" "}
                              đ
                            </span>
                          </div>
                        )}
                      </div>

                      {booking.status === "pending" && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-full py-2.5 rounded-xl border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-all font-medium text-sm"
                        >
                          Hủy đơn
                        </button>
                      )}

                      {booking.status === "approved" && (
                        <Link
                          to={`/return/${booking._id}`}
                          className="w-full py-2.5 rounded-xl border border-[#32d3d2] text-[#32d3d2] hover:bg-[#32d3d2] hover:text-white transition-all font-medium text-sm flex items-center justify-center gap-2"
                        >
                          Trả đồ chơi
                        </Link>
                      )}

                      {[
                        "completed",
                        "rejected",
                        "cancelled",
                        "returned",
                        "waiting_refund",
                      ].includes(booking.status) && (
                        <div className="w-full py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 font-medium text-sm text-center">
                          {translateStatus(booking.status)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MyBookings;

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  getOwnerBookings,
  updateBookingStatus,
} from "@/services/bookingService";
import { showSuccess, showError, showConfirm } from "@/components/alert";

/**
 * OwnerBookings Component
 * Handles the display of rental requests for the owner's toys.
 * Uses Tailwind CSS for styling and maintains consistency with MyBookings UI.
 */
function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [currentRefund, setCurrentRefund] = useState(null);

  // Retrieve user from local storage
  const user = JSON.parse(localStorage.getItem("user"));

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
      const res = await getOwnerBookings(user._id);
      const data = Array.isArray(res.data) ? res.data : [];
      console.log(data);
      
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = (booking) => {
    const refundAmount = Math.max(
      0,
      (booking.deposit || 0) - (booking.price || 0),
    );

    if (refundAmount <= 0) {
      // No refund needed, just complete
      handleUpdateStatus(booking._id, "completed");
      return;
    }

    setCurrentRefund({
      start_date: booking.createdAt,
      amount: refundAmount,
      bookingId: booking._id,
      bankName: booking.userId?.bank_name,
      bankNumber: booking.userId?.bank_number,
      userName: booking.userId?.name,
    });
    setShowQR(true);
  };

  const handleUpdateStatus = async (id, status) => {
    let actionText = "";
    let confirmText = "";

    if (status === "approved") {
      actionText = "duyệt";
      confirmText = "Duyệt đơn";
    } else if (status === "rejected") {
      actionText = "từ chối";
      confirmText = "Từ chối";
    } else if (status === "completed") {
      actionText = "hoàn tất (đã hoàn tiền)";
      confirmText = "Xác nhận";
    }

    const isConfirm = await showConfirm(
      `Xác nhận ${actionText}?`,
      `Bạn có chắc chắn muốn ${actionText} yêu cầu thuê này không?`,
      confirmText,
    );

    if (!isConfirm) return;

    try {
      await updateBookingStatus(id, status);

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b)),
      );

      if (status === "approved") {
        showSuccess("Đã duyệt thành công!");
      } else if (status === "rejected") {
        showSuccess("Đã từ chối!");
      } else {
        showSuccess("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showError("Có lỗi xảy ra, vui lòng thử lại.");
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

  // Helper to translate status to Vietnamese
  const translateStatus = (status) => {
    const map = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Bị từ chối",
      returned: "Đã trả",
      waiting_refund: "Chờ hoàn tiền",
      completed: "Hoàn tất",
    };
    return map[status] || status;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Quản lý đơn thuê
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Danh sách các yêu cầu thuê đồ chơi của bạn. Duyệt hoặc từ chối các
              yêu cầu đang chờ.
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
            // Empty State
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                Chưa có yêu cầu thuê nào
              </h3>
              <p className="text-slate-500 mb-6">
                Hiện tại chưa có ai gửi yêu cầu thuê đồ chơi của bạn.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-[#32d3d2] hover:bg-[#2bc0bf] text-white font-medium rounded-full transition-colors shadow-sm hover:shadow-md"
              >
                Về trang chủ
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
                  {/* Image Section - Fixed size 288px x 224px (w-72 h-56) */}
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
                            Người thuê
                          </span>
                          <span className="font-medium text-slate-700">
                            {booking.userId?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-slate-400 text-xs uppercase">
                            Liên hệ
                          </span>
                          <span className="font-medium text-slate-700 font-mono">
                            {booking.userId?.phone || "Chưa cập nhật"}
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

                      {booking.feedback && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <span className="text-slate-400 text-xs uppercase font-semibold block mb-2">
                            Feedback từ khách
                          </span>
                          <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                            {booking.feedback}
                          </p>
                        </div>
                      )}
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

                        {booking.price && booking.price > 0 && (
                          <div className="flex justify-between items-center md:flex-col md:items-end">
                            <span className="text-slate-400 text-xs uppercase mb-1">
                              Tổng tiền thuê
                            </span>
                            <span className="font-semibold text-slate-700">
                              {booking.price?.toLocaleString()} đ
                            </span>
                          </div>
                        )}

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

                        {(booking.status === "returned" ||
                          booking.status === "waiting_refund" ||
                          booking.status === "completed") && (
                          <div className="flex justify-between items-center md:flex-col md:items-end">
                            <span className="text-slate-400 text-xs uppercase mb-1">
                              Tiền cần hoàn
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

                        {booking.status === "pending" && (
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
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto pt-2 flex flex-col items-center">
                        {booking.status === "pending" ? (
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "approved")
                              }
                              className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors shadow-sm"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking._id, "rejected")
                              }
                              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors shadow-sm"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : (booking.status === "returned" ||
                          booking.status === "waiting_refund") ? (
                          <button
                            onClick={() => handleProcessRefund(booking)}
                            className="w-full py-2.5 rounded-xl bg-[#32d3d2] hover:bg-[#2bc0bf] text-white font-medium text-sm transition-colors shadow-sm"
                          >
                            Hoàn tiền ngay
                          </button>

                        ) : (
                          <div className="w-full py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 font-medium text-sm text-center select-none cursor-default">
                            {booking.status === "approved"
                              ? "Đã chấp nhận"
                              : booking.status === "rejected"
                                ? "Đã từ chối"
                                : "Đã hoàn thành"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {showQR && currentRefund && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full mx-auto shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Quét mã để hoàn tiền
              </h3>
              <p className="text-slate-500 text-sm">
                Sử dụng ứng dụng ngân hàng để quét mã QR bên dưới
              </p>
            </div>

            <div className="bg-[#f0f9ff] p-4 rounded-2xl mb-6 border border-blue-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Người nhận:</span>
                <span className="font-bold text-slate-800">
                  {currentRefund.userName}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Số tiền hoàn:</span>
                <span className="font-bold text-[#32d3d2] text-lg">
                  {currentRefund.amount.toLocaleString()} đ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Nội dung:</span>
                <span className="font-mono text-slate-600 text-xs">
                  REFUND ToyZone{" "}
                  {new Date(currentRefund.start_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="aspect-square bg-white p-2 rounded-xl border border-slate-100 shadow-inner mb-6 flex items-center justify-center">
              <img
                src={`https://img.vietqr.io/image/${currentRefund.bankName}-${currentRefund.bankNumber}-compact2.jpg?amount=${currentRefund.amount}&addInfo=Hoan tien coc ToyZone`}
                alt="QR Code"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleUpdateStatus(currentRefund.bookingId, "completed");
                  setShowQR(false);
                }}
                className="w-full py-3 bg-[#32d3d2] hover:bg-[#2bc0bf] text-white font-bold rounded-xl shadow-lg shadow-teal-100 transition-all text-sm uppercase tracking-wide"
              >
                Xác nhận đã chuyển khoản
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerBookings;

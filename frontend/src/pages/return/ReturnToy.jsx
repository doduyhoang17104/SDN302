import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBookingDetails, returnToy } from "@/services/bookingService";
import { showSuccess, showError, showConfirm } from "@/components/alert";

function ReturnToy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await getBookingDetails(id);
      setBookingData(res.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      showError("Không thể tải thông tin đơn hàng");
      navigate("/my-bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReturn = async () => {
    const isConfirm = await showConfirm(
      "Xác nhận trả đồ chơi?",
      "Bạn có chắc chắn muốn hoàn tất việc trả đồ chơi này không?",
      "Xác nhận trả"
    );

    if (!isConfirm) return;

    try {
      await returnToy(id, { feedback: feedback.trim() });
      showSuccess("Trả đồ chơi thành công!");
      navigate("/my-bookings");
    } catch (error) {
      console.error("Error returning toy:", error);
      showError("Có lỗi xảy ra khi trả đồ chơi");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#32d3d2] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bookingData) return null;


  const { booking, calculation } = bookingData;
  const { toyId, deposit } = booking;
  const owner = toyId?.owner;
  
  const rentalPrice = calculation?.rentalPrice || 0;
  const finalPayment = rentalPrice - deposit;
  const qrUrl = `https://img.vietqr.io/image/${owner?.bank_name || "MB"}-${owner?.bank_number || "0123456789"}-compact2.jpg?amount=${finalPayment}&addInfo=ToyZone Return ${booking._id}`;

  const handleReturnClick = () => {
     if (finalPayment > 0) {
        setShowQR(true);
     } else {
        handleConfirmReturn();
     }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">
                Xác nhận trả đồ chơi
              </h1>
              <p className="text-center text-slate-500 mt-2 text-sm">
                Vui lòng kiểm tra lại thông tin và xác nhận thanh toán/hoàn tiền
              </p>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column: Toy Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Thông tin đồ chơi
                  </h2>
                  <div className="flex gap-5 items-start">
                    <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative group">
                      <img
                        src={toyId?.image || "https://placehold.co/600x400?text=No+Image"}
                        alt={toyId?.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-2">
                       <h3 className="font-bold text-slate-800 text-xl leading-snug">{toyId?.name}</h3>
                       <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                          {toyId?.category}
                       </span>
                       <div className="text-sm text-slate-500 font-medium">
                          Giá thuê: <span className="text-slate-800">{toyId?.price?.toLocaleString()} đ</span> / tuần
                       </div>
                    </div>
                  </div>
                </div>

                <div>
                   <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Liên hệ chủ đồ chơi
                   </h2>
                   <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500 font-medium">Họ tên:</span>
                       <span className="font-bold text-slate-700 text-base">{owner?.name || "N/A"}</span>
                      </div>
                      <div className="w-full h-px bg-slate-200/60"></div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500 font-medium">Số điện thoại:</span>
                       <span className="font-bold text-slate-700 font-mono text-base">{owner?.phone || "N/A"}</span>
                      </div>
                   </div>
                </div>

                 <div>
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Feedback đồ chơi
                  </h2>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Chia sẻ trải nghiệm của bạn về đồ chơi (chất lượng, độ mới, cách đóng gói...)"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-[#32d3d2] focus:ring-2 focus:ring-[#32d3d2]/20"
                  />
                  <p className="mt-2 text-xs text-slate-400 text-right">
                    {feedback.length}/500 ký tự
                  </p>
                 </div>
              </div>

              {/* Right Column: Calculations */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Chi tiết thanh toán
                  </h2>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Time Info */}
                    <div className="bg-slate-50/50 p-5 space-y-2 border-b border-slate-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Ngày thuê:</span>
                        <span className="font-medium text-slate-900">
                           {new Date(calculation?.startDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Ngày trả:</span>
                        <span className="font-medium text-slate-900">
                           {new Date(calculation?.returnDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-1">
                        <span className="text-slate-600">Thời gian thuê:</span>
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                           {calculation?.diffDays} ngày ({calculation?.weeks} tuần)
                        </span>
                      </div>
                    </div>

                    {/* Cost Calculation */}
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-600">Tổng tiền thuê:</span>
                         <span className="font-semibold text-slate-900">
                            {rentalPrice?.toLocaleString()} đ
                         </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-600">Đã đặt cọc:</span>
                         <span className="font-semibold text-green-600">
                            - {deposit?.toLocaleString()} đ
                         </span>
                      </div>

                      <div className="w-full h-px bg-slate-200"></div>

                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">
                           {finalPayment >= 0 ? "Cần thanh toán thêm:" : "Được hoàn lại:"}
                        </span>
                        <span className={`text-2xl font-extrabold ${finalPayment >= 0 ? "text-red-500" : "text-emerald-500"}`}>
                          {Math.abs(finalPayment)?.toLocaleString()} đ
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>

                <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="flex-1 py-3.5 px-6 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleReturnClick}
                    className="flex-1 py-3.5 px-6 bg-[#32d3d2] hover:bg-[#2bc0bf] text-white font-bold rounded-xl shadow-lg shadow-[#32d3d2]/20 transition-all transform active:scale-95"
                  >
                    Xác nhận trả đồ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showQR && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-2xl transform transition-all scale-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Thanh toán chi phí phát sinh</h2>
            <p className="text-slate-500 text-sm mb-6">Vui lòng quét mã QR để thanh toán cho chủ đồ chơi</p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 inline-block">
               <img src={qrUrl} alt="QR Payment" className="mx-auto w-64 h-64 object-contain mix-blend-multiply" />
            </div>

            <div className="bg-blue-50 text-blue-700 text-sm py-2 px-4 rounded-lg mb-6 font-medium inline-block w-full">
              Số tiền: <span className="font-bold text-lg align-middle ml-1">{finalPayment?.toLocaleString()} đ</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowQR(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                onClick={handleConfirmReturn}
                className="flex-1 py-3 rounded-xl bg-[#32d3d2] hover:bg-[#2bc0bf] text-white font-bold shadow-lg shadow-[#32d3d2]/20 transition-all"
              >
                Đã thanh toán
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ReturnToy;
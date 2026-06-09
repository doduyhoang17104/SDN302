import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import { getAllToys, getToyOwner } from "@/services/toyService";
import { createBooking } from "@/services/bookingService";
import { showError, showSuccess } from "@/components/alert";
const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toy, setToy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [shippingAddress, setShippingAddress] = useState();
  const [showQR, setShowQR] = useState(false);
  const [owner, setOwner] = useState(null);
  const fetchOwner = async () => {
    const res = await getToyOwner(id);
    console.log(res.data);
    setOwner(res.data);
  };
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log(user);

        setUser(user);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }

    const fetchToyDetails = async () => {
      try {
        setLoading(true);
        const res = await getAllToys();
        const foundToy = res.data.find((t) => t._id === id || t.id === id);
        if (foundToy) {
          setToy(foundToy);
        } else {
          setToy({
            _id: id,
            name: "Đồ chơi mẫu (Mock Data)",
            deposit: 50000,
            image: "https://placehold.co/600x400?text=ToyZone",
            owner: { name: "Nguyễn Văn A" },
          });
        }
      } catch (error) {
        console.error("Error fetching toy:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchToyDetails();
      fetchOwner();
    }
  }, [id]);

  const calculateTotal = () => {
    if (!toy) return 0;
    const price = toy.deposit || 0;
    const shippingFee = 15000;
    return price + shippingFee;
  };
  const qrUrl = `https://img.vietqr.io/image/${owner?.bank_name}-${owner?.bank_number}-compact2.jpg?amount=${calculateTotal()}&addInfo=ToyZone`;
  const handleCheckout = async () => {
    try {
      const booking = {
        userId: user._id,
        toyId: toy._id,
        name: user.name,
        phone: user.phone,
        shippingAddress: shippingAddress,
        price: "",
        feedback: "",
        deposit: toy.deposit,
      };

      await createBooking(booking);

      showSuccess("Đặt thuê thành công");

      navigate("/my-bookings");
    } catch (error) {
      console.error(error);
      showError("Có lỗi xảy ra khi đặt thuê");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#32d3d2]"></div>
      </div>
    );
  }

  if (!toy) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-700">
              Không tìm thấy sản phẩm
            </h2>
            <button
              onClick={() => navigate("/toys")}
              className="mt-4 text-[#32d3d2] hover:underline"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-[#32d3d2] transition-colors mb-6 font-medium"
          >
            <FiArrowLeft /> Quay lại
          </button>

          <h1 className="text-3xl font-bold text-slate-800 mb-8">
            Thanh toán & Thuê đồ
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Thông tin nhận hàng
                    </h2>
                    <p className="text-sm text-slate-500">
                      Vui lòng điền địa chỉ giao nhận chính xác
                    </p>
                  </div>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#32d3d2] focus:ring-2 focus:ring-[#32d3d2]/20 outline-none transition-all"
                      value={user.name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0912345678"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#32d3d2] focus:ring-2 focus:ring-[#32d3d2]/20 outline-none transition-all"
                      value={user.phone}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tỉnh/Thành phố
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Hà Nội, TP.HCM..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#32d3d2] focus:ring-2 focus:ring-[#32d3d2]/20 outline-none transition-all"
                      value={user.address}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Địa chỉ nhận hàng
                    </label>
                    <input
                      type="text"
                      name="addressDetail"
                      placeholder="Số nhà, tên đường, phường/xã..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#32d3d2] focus:ring-2 focus:ring-[#32d3d2]/20 outline-none transition-all"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
                <h3 className="text-lg font-bold text-slate-800 mb-6">
                  Đơn hàng của bạn
                </h3>

                {/* Product Item */}
                <div className="flex gap-4 mb-6">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                    <img
                      src={toy.image || "https://placehold.co/150"}
                      alt={toy.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 line-clamp-2 text-sm mb-1">
                      {toy.name}
                    </h4>
                    <span className="text-xs text-slate-500 block mb-1">
                      Chủ sở hữu: {toy.owner?.name || "Ẩn danh"}
                    </span>
                    <span className="text-[#32d3d2] font-bold text-sm">
                      {toy.price?.toLocaleString()} đ
                    </span>
                  </div>
                </div>

                {/* Costs */}
                <div className="space-y-3 py-4 border-t border-b border-slate-50 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tiền cọc</span>
                    <span className="font-medium text-slate-800">
                      {toy.deposit?.toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1">
                      <FiPackage /> Phí dịch vụ
                    </span>
                    <span className="font-medium text-slate-800">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1">
                      <FiTruck /> Phí vận chuyển
                    </span>
                    <span className="font-medium text-slate-800">15,000 đ</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-slate-800">Tổng cộng</span>
                  <span className="text-2xl font-extrabold text-[#32d3d2]">
                    {calculateTotal().toLocaleString()} đ
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => setShowQR(true)}
                  className="w-full py-4 bg-[#32d3d2] hover:bg-[#2aa8a7] text-white font-bold rounded-xl shadow-lg shadow-teal-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Xác nhận thuê ngay
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  Bằng việc xác nhận, bạn đồng ý với điều khoản sử dụng của
                  ToyZone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showQR && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[360px] text-center">
            <h2 className="text-xl font-bold mb-4">Quét QR để thanh toán</h2>

            <img src={qrUrl} alt="QR Payment" className="mx-auto w-64" />

            <p className="mt-3 text-sm text-gray-500">
              Số tiền: {calculateTotal().toLocaleString()} đ
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowQR(false)}
                className="flex-1 border py-2 rounded-lg"
              >
                Huỷ
              </button>

              <button
                onClick={handleCheckout}
                className="flex-1 bg-[#32d3d2] text-white py-2 rounded-lg"
              >
                Tôi đã thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Checkout;

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiSearch, FiMapPin, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAllToys } from "@/services/toyService";

const ToyList = () => {
  const [toys, setToys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchToys();
  }, []);

  const fetchToys = async () => {
    try {
      setIsLoading(true);
      const res = await getAllToys();
      // Ensure we have an array
      const data = Array.isArray(res.data) ? res.data : [];
      setToys(data);
    } catch (error) {
      console.error("Failed to fetch toys:", error);
      setToys([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter logic: Search by name only
  const filteredToys = toys.filter((toy) =>
    toy.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-grow pb-12 pt-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section with Search */}
          <div className="flex flex-col items-center mb-10 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-center">
              Khám Phá Đồ Chơi
            </h1>
            <p className="text-slate-500 text-center max-w-xl">
              Tìm kiếm và thuê những món đồ chơi thú vị từ cộng đồng xung quanh
              bạn.
            </p>

            {/* Search Bar - Centered and improved */}
            <div className="w-full max-w-2xl relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch
                  className="text-slate-400 group-focus-within:text-[#32d3d2] transition-colors"
                  size={22}
                />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên đồ chơi..."
                className="w-full pl-12 pr-6 py-4 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md focus:shadow-lg focus:border-[#32d3d2] focus:ring-4 focus:ring-[#32d3d2]/10 outline-none transition-all duration-300 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Loading State Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-80"
                >
                  <div className="h-48 bg-slate-200 w-full"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredToys.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <FiShoppingBag className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                {searchTerm ? "Không tìm thấy kết quả" : "Chưa có đồ chơi nào"}
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                {searchTerm
                  ? `Không tìm thấy đồ chơi nào phù hợp với từ khóa "${searchTerm}".`
                  : "Hiện tại chưa có danh sách đồ chơi. Vui lòng quay lại sau."}
              </p>
            </div>
          )}

          {/* Toys Grid */}
          {!isLoading && filteredToys.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
              {filteredToys.map((toy) => {
                const owner = toy.owner || {};
                const ownerName = owner.name || "Người dùng ẩn danh";
                const ownerAddress = owner.address || "Chưa cập nhật";
                const toyImage =
                  toy.image || "https://placehold.co/600x400?text=ToyZone";

                return (
                  <div
                    key={toy._id || toy.id}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                      <Link to={`/checkout/${toy._id}`}>
                        <img
                          src={toyImage}
                          alt={toy.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/600x400?text=No+Image";
                          }}
                        />
                      </Link>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md border border-white/20 ${
                            toy.status === "available"
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-500 text-white"
                          }`}
                        >
                          {toy.status === "available" ? "Sẵn sàng" : "Đã thuê"}
                        </span>
                      </div>

                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-3 left-3">
                        <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-white/50 text-[#32d3d2] font-extrabold text-sm">
                          {toy.price?.toLocaleString()} đ/tuần
                        </div>
                      </div>
                    </div>
                    {/* Card Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-2">
                        {toy.category && (
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1 block">
                            {toy.category}
                          </span>
                        )}
                        <Link to={`/checkout/${toy._id}`} className="block">
                          <h3
                            className="text-lg font-bold text-slate-800 leading-tight line-clamp-1 group-hover:text-[#32d3d2] transition-colors"
                            title={toy.name}
                          >
                            {toy.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-1.5 text-slate-500 mb-4 text-xs">
                        <FiMapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span className="truncate line-clamp-1">
                          {ownerAddress}
                        </span>
                      </div>
                      {/* Deposit */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-slate-500">Tiền cọc</span>
                        <span className="font-semibold text-slate-700">
                          {toy.deposit?.toLocaleString()} đ
                        </span>
                      </div>
                      {/* Footer: Owner & Action */}
                      <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                            {ownerName.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className="text-xs font-medium text-slate-600 truncate max-w-[80px]"
                            title={ownerName}
                          >
                            {ownerName}
                          </span>
                        </div>

                        <Link
                          to={`/checkout/${toy._id}`}
                          className="bg-[#32d3d2] hover:bg-[#2aa8a7] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm shadow-teal-100"
                        >
                          Thuê ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToyList;

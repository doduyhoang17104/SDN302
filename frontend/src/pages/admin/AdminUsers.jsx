import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "@/services/userSevice";
import { showError, showSuccess,showConfirm } from "@/components/alert";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      // Ensure we have an array
      const userList = Array.isArray(res.data) ? res.data : [];
      setUsers(userList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      if (error.response && error.response.status === 403) {
        showError("Bạn không có quyền truy cập trang này");
        navigate("/");
      } else {
        showError(error.response?.data?.message || "Lỗi khi tải danh sách người dùng");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await showConfirm("Bạn có chắc muốn xóa người dùng này?");
    if (!confirmed) return;

    try {
      await deleteUser(id);
      showSuccess("Xóa người dùng thành công");
      fetchUsers();
    } catch (error) {
       showError(error.response?.data?.message || "Lỗi khi xóa người dùng");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 transition-all duration-300 hidden md:flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-slate-800 bg-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-xl font-black text-white">T</span>
             </div>
             <div className="flex flex-col">
                <h1 className="text-lg font-extrabold text-white tracking-wide leading-none">TOY<span className="text-blue-400">ZONE</span></h1>
                <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-0.5">Admin Panel</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <button className="w-full flex items-center px-4 py-3 text-left rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <span className="mr-3">👥</span> Quản lý User
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
                <span className="mr-3">🚪</span> Đăng xuất
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center md:hidden">
            <button className="p-2 -ml-2 text-gray-500 hover:text-gray-700">
              ☰
            </button>
          </div>
          
          <div className="flex-1 max-w-xl ml-4 md:ml-0">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">🔍</span>
                <input 
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    A
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
             </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 z-10 relative">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Danh sách người dùng</h2>
                    <p className="text-sm text-slate-500 mt-1">Quản lý tài khoản và phân quyền hệ thống</p>
                </div>
                <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 self-start sm:self-auto">
                    Tổng: <span className="text-blue-600 text-lg font-bold ml-1">{users.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người dùng</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase text-sm">
                                            {user.username?.charAt(0) || "U"}
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{user.name || "Chưa đặt tên"}</div>
                                        <div className="text-xs text-gray-500">@{user.username}</div>
                                    </div>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 flex flex-col gap-0.5">
                                        <span>📧 {user.email}</span>
                                        {user.phone && <span className="text-xs text-gray-400">📱 {user.phone}</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                    : 'bg-green-100 text-green-700 border border-green-200'
                                }`}>
                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {user.role !== 'admin' && (
                                    <button 
                                    onClick={() => handleDelete(user._id)} 
                                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border border-red-100"
                                    title="Xóa người dùng"
                                    >
                                    Xóa
                                    </button>
                                )}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <span className="text-4xl mb-2">🔍</span>
                                        <p className="text-sm mb-1">Không tìm thấy người dùng nào</p>
                                        <p className="text-xs">Thử thay đổi từ khóa tìm kiếm</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                    {/* Pagination Mockup */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Hiển thị {filteredUsers.length} kết quả</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs border rounded bg-white text-gray-400 cursor-not-allowed">Trước</button>
                            <button className="px-3 py-1 text-xs border rounded bg-white text-gray-600 hover:bg-gray-50">Sau</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;

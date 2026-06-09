import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { updateProfile } from "@/services/userSevice";
import { showError, showSuccess } from "@/components/alert";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    bank_name: "",
    bank_number: "",
  });
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch("https://api.vietqr.io/v2/banks");
        const data = await res.json();
        setBanks(data.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách ngân hàng", error);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          name: userData.name || "",
          phone: userData.phone || "",
          address: userData.address || "",
          bank_name: userData.bank_name || "",
          bank_number: userData.bank_number || "",
        });
      } catch (error) {
        console.error("Lỗi parse user data", error);
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      bank_name: user.bank_name || "",
      bank_number: user.bank_number || "",
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      bank_name: user.bank_name || "",
      bank_number: user.bank_number || "",
    });
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(formData);
      const updatedUser = { ...user, ...res.data.user };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      showSuccess("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Lỗi khi cập nhật thông tin");
    }
  };

  if (!user) {
    return null;
  }

  const avatarInitial = (user.name || user.username || user.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-container">
        <h1
          className="mb-4 d-none d-md-block"
          style={{ fontSize: "28px", fontWeight: "bold" }}
        >
          Hồ sơ của tôi
        </h1>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">{avatarInitial}</div>
            <div className="profile-details-wrapper" style={{ flex: 1 }}>
              <div className="profile-title-group">
                <h2>{user.name || user.username}</h2>
                <span className="role-badge">Thành viên ToyZone</span>
              </div>
            </div>
            {!isEditing && (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleEdit}
                style={{ borderColor: "#ff5f93", color: "#ff5f93" }}
              >
                Chỉnh sửa
              </button>
            )}
          </div>
          <form className="profile-info-grid" onSubmit={handleSave}>
            {/* Tên hiển thị */}
            <div className="info-group">
              <label>Tên hiển thị</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <div className="info-value">{user.name || "Chưa cập nhật"}</div>
              )}
            </div>

            {/* Username */}
            <div className="info-group">
              <label>Tên đăng nhập</label>
              <div
                className="info-value"
                style={{ backgroundColor: "#f0f2f5", color: "#65676b" }}
              >
                {user.username}
              </div>
            </div>

            {/* Email */}
            <div className="info-group">
              <label>Email</label>
              <div
                className="info-value"
                style={{ backgroundColor: "#f0f2f5", color: "#65676b" }}
              >
                {user.email}
              </div>
            </div>

            {/* Phone */}
            <div className="info-group">
              <label>Số điện thoại</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <div className="info-value">
                  {user.phone || "Chưa cập nhật"}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="info-group" style={{ gridColumn: "1 / -1" }}>
              <label>Địa chỉ</label>
              {isEditing ? (
                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                />
              ) : (
                <div className="info-value">
                  {user.address || "Chưa cập nhật"}
                </div>
              )}
            </div>

            {/* Bank name */}
            <div className="info-group">
              <label>Tên ngân hàng</label>

              {isEditing ? (
                <select
                  name="bank_name"
                  className="form-control"
                  value={formData.bank_name}
                  onChange={handleChange}
                >
                  <option value="">Chọn ngân hàng</option>

                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.shortName}>
                      {bank.shortName}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="info-value">
                  {user.bank_name || "Chưa cập nhật"}
                </div>
              )}
            </div>

            {/* Bank number */}
            <div className="info-group">
              <label>Số tài khoản ngân hàng</label>

              {isEditing ? (
                <input
                  type="text"
                  name="bank_number"
                  className="form-control"
                  placeholder="Nhập số tài khoản"
                  value={formData.bank_number}
                  onChange={handleChange}
                />
              ) : (
                <div className="info-value">
                  {user.bank_number || "Chưa cập nhật"}
                </div>
              )}
            </div>

            {/* Buttons */}
            {isEditing && (
              <div
                className="d-flex justify-content-end gap-2 mt-3"
                style={{ gridColumn: "1 / -1" }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#ff5f93",
                    borderColor: "#ff5f93",
                  }}
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;

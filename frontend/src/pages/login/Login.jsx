import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess } from "@/components/alert";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = res.data;

      // lưu token
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      // lưu user
      localStorage.setItem("user", JSON.stringify(user));

      showSuccess("Đăng nhập thành công!");

      if (user.role === 'admin') {
        navigate("/admin/users");
      } else {
        navigate("/");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Lỗi server");
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-badge">ToyZone</span>
          <h2 className="login-title">Chào mừng quay lại!</h2>
          <p className="login-subtitle">
            Đăng nhập để tiếp tục khám phá thế giới đồ chơi
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Địa chỉ email hoặc tên người dùng
            </label>

            <input
              type="text"
              className="form-input"
              placeholder="Nhập email hoặc tên người dùng của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>

            <input
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>

        <div className="login-footer">
          <p>
            Chưa có tài khoản?{" "}
            <Link to="/register" className="login-link">
              Đăng ký
            </Link>
          </p>

          <div className="login-footer-secondary">
            <Link to="/forgot-password" className="login-link muted-link">
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <div className="login-actions">
          <Link to="/" className="back-home-button">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

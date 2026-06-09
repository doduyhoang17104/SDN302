import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess, showWarning } from "@/components/alert";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check confirm password
    if (password !== confirmPassword) {
      showWarning("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        username,
        password,
        address,
        phone,
      });

      showSuccess("Đăng ký thành công!");

      // reset form
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setAddress("");
      setPhone("");
      // chuyển sang login
      navigate("/login");
    } catch (error) {
      showError(error.response?.data?.message || "Lỗi server");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <span className="register-badge">ToyZone</span>

          <h2 className="register-title">Tạo tài khoản mới</h2>

          <p className="register-subtitle">
            Đăng ký để bắt đầu chia sẻ và khám phá đồ chơi
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Name */}

          <div className="register-form-group">
            <label className="register-form-label">
              Họ và tên <span style={{ color: "red" }}>*</span>
            </label>

            <input
              type="text"
              className="register-form-input"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}

          <div className="register-form-group">
            <label className="register-form-label">
              Email <span style={{ color: "red" }}>*</span>
            </label>

            <input
              type="email"
              className="register-form-input"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}

          <div className="register-form-group">
            <label className="register-form-label">
              Số điện thoại <span style={{ color: "red" }}>*</span>
            </label>

            <input
              type="tel"
              className="register-form-input"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Address */}

          <div className="register-form-group">
            <label className="register-form-label">Địa chỉ</label>

            <input
              type="text"
              className="register-form-input"
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {/* Username */}

          <div className="register-form-group">
            <label className="register-form-label">
              Tài khoản <span style={{ color: "red" }}>*</span>
            </label>

            <input
              type="text"
              className="register-form-input"
              placeholder="Nhập tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {/* Password */}

          <div className="register-form-group">
            <label className="register-form-label">
              Mật khẩu <span style={{ color: "red" }}>*</span>
            </label>

            <input
              type="password"
              className="register-form-input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm password */}

          <div className="register-form-group">
            <label className="register-form-label">
              Xác nhận mật khẩu <span style={{ color: "red" }}>*</span>
            </label>

            <input
              type="password"
              className="register-form-input"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="register-button">
            Đăng ký
          </button>
        </form>

        <div className="register-footer">
          <p>
            Đã có tài khoản?
            <Link to="/login" className="register-link">
              Đăng nhập
            </Link>
          </p>
        </div>

        <div className="register-actions">
          <Link to="/" className="register-back-home-button">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

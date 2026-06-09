import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess, showWarning } from "@/components/alert";
import "../login/Login.css";
import "./ResetPassword.css";

function ResetPassword() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");

  const handleSubmit = async (event)=>{

    event.preventDefault();

    if(password !== confirmPassword){
      showWarning("Mật khẩu xác nhận không khớp");
      return;
    }

    try{

      const res = await axios.post(
        "http://localhost:3000/api/auth/reset-password",
        { email, password }
      );

      showSuccess(res.data.message);

      navigate("/login");

    }catch(err){

      showError(err.response?.data?.message || "Lỗi server");

    }

  };

  return (
    <div className="login-container auth-flow-page">
      <div className="login-card auth-flow-card">
        <div className="login-header">
          <span className="login-badge">ToyZone</span>
          <h1 className="login-title">Đặt lại mật khẩu</h1>
          <p className="login-subtitle auth-flow-subtitle">
            Tạo mật khẩu mới để bảo vệ tài khoản và tiếp tục đăng nhập.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reset-password-input">
              Mật khẩu mới
            </label>
          <input
            id="reset-password-input"
            type="password"
            className="form-input"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reset-password-confirm-input">
              Xác nhận mật khẩu
            </label>
          <input
            id="reset-password-confirm-input"
            type="password"
            className="form-input"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
          />
          </div>

          <button type="submit" className="login-button">
            Đặt lại mật khẩu
          </button>
        </form>

        <div className="login-footer auth-flow-footer">
          <p>Bạn muốn quay lại?</p>

          <div className="login-footer-secondary">
            <Link to="/login" className="login-link muted-link">
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
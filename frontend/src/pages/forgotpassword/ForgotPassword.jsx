import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess } from "@/components/alert";
import "../login/Login.css";
import "./ForgotPassword.css";

function ForgotPassword() {

  const navigate = useNavigate();
  const [email,setEmail] = useState("");

  const handleSubmit = async (event)=>{
    event.preventDefault();

    try{

      const res = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email }
      );

      showSuccess(res.data.message);

      navigate("/verify-otp",{ state:{ email } });

    }catch(err){

      showError(err.response?.data?.message || "Lỗi server");

    }

  };

  return (
    <div className="login-container auth-flow-page">
      <div className="login-card auth-flow-card">
        <div className="login-header">
          <span className="login-badge">ToyZone</span>
          <h1 className="login-title">Quên mật khẩu?</h1>
          <p className="login-subtitle auth-flow-subtitle">
            Nhập email để nhận OTP
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-password-email">
              Địa chỉ email
            </label>
          <input
            id="forgot-password-email"
            type="email"
            className="form-input"
            placeholder="Nhập email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          </div>

          <button type="submit" className="login-button">
            Nhận OTP
          </button>
        </form>

        <div className="login-footer auth-flow-footer">
          <p>Bạn đã nhớ mật khẩu?</p>

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

export default ForgotPassword;
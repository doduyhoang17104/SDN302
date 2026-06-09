import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { showError, showSuccess } from "@/components/alert";
import "../login/Login.css";
import "./VerifyOTP.css";

function VerifyOTP() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  // lưu OTP từng ô
  const [otp,setOtp] = useState(["","","","","",""]);

  const inputsRef = useRef([]);

  const handleChange = (value,index)=>{

    if(!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // auto next input
    if(value && index < 5){
      inputsRef.current[index+1].focus();
    }

  };


  const handleKeyDown = (e,index)=>{

    if(e.key === "Backspace" && !otp[index] && index > 0){
      inputsRef.current[index-1].focus();
    }

  };


  const handleSubmit = async (event)=>{

    event.preventDefault();

    const otpValue = otp.join("");

    if(otpValue.length !== 6){
      showError("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    try{

      const res = await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        { email, otp: otpValue }
      );

      showSuccess(res.data.message);

      navigate("/reset-password",{ state:{ email } });

    }catch(err){

      showError(err.response?.data?.message || "OTP không hợp lệ");

    }

  };

  return (
    <div className="login-container auth-flow-page">

      <div className="login-card auth-flow-card">

        <div className="login-header">
          <span className="login-badge">ToyZone</span>
          <h1 className="login-title">Xác thực OTP</h1>
          <p className="login-subtitle auth-flow-subtitle">
            Nhập mã OTP đã được gửi đến email của bạn
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <label className="form-label">Mã OTP</label>

          <div className="otp-container">

            {otp.map((digit,index)=>(
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el)=>inputsRef.current[index]=el}
                onChange={(e)=>handleChange(e.target.value,index)}
                onKeyDown={(e)=>handleKeyDown(e,index)}
                className="otp-input"
              />
            ))}

          </div>

          <button type="submit" className="login-button">
            Xác nhận OTP
          </button>

        </form>

        <div className="login-footer auth-flow-footer">
          <p>Chưa nhận được mã?</p>

          <Link to="/forgot-password" className="login-link muted-link">
            Gửi lại OTP
          </Link>

        </div>

      </div>

    </div>
  );
}

export default VerifyOTP;
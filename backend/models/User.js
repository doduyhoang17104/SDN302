const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: [true, "Tên không được để trống"],
    trim: true
  },

  email: {
    type: String,
    required: [true, "Email không được để trống"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
  },

  username: {
    type: String,
    required: [true, "Username không được để trống"],
    unique: true,
    trim: true,
    minlength: 3
  },

  password: {
    type: String,
    required: [true, "Password không được để trống"],
    minlength: 6
  },

  address: {
    type: String,
    default: ""
  },

  phone: {
    type: String,
    default: ""
  },
  bank_name: {
    type: String,
    default: ""
  },
  bank_number: {
    type: String,
    default: ""
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  // Refresh token cho JWT authentication
  refreshToken: {
    type: String,
    default: null
  },

  // OTP reset password
  otp: {
    type: String,
    default: null
  },

  otpExpire: {
    type: Date,
    default: null
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);
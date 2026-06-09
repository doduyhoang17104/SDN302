// import model User
const User = require("../models/User");

// thư viện mã hóa password
const bcrypt = require("bcryptjs");

// thư viện tạo JWT token
const jwt = require("jsonwebtoken");

// import gửi email OTP
const transporter = require("../config/email");

/* ================================ GET ME ================================ */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -passwordConfirm");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const { password, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================================ REGISTER ================================ */
exports.register = async (req, res) => {
  try {
    const { name, email, username, password, address, phone } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.status(400).json({ message: "Tên tài khoản đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      username,
      password: hashedPassword,
      address,
      phone,
      role: "user" 
    });

    await user.save();

    res.json({ message: "Đăng ký tài khoản thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================================ LOGIN ================================ */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không khớp" });
    }

    // ACCESS TOKEN (ngắn hạn)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "15m" }
    );

    // REFRESH TOKEN (dài hạn)
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_REFRESH_SECRET || "refreshsecret",
      { expiresIn: "7d" }
    );

    // lưu refresh token vào DB
    user.refreshToken = refreshToken;
    await user.save();

    const { password: pass, ...userData } = user._doc;

    res.json({
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================================ REFRESH TOKEN ================================ */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "Refresh token không hợp lệ" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refreshsecret",
      (err) => {
        if (err) {
          return res.status(403).json({ message: "Token không hợp lệ" });
        }

        const newAccessToken = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET || "secretkey",
          { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================================ LOGOUT ================================ */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.json({ message: "Logout thành công" });
    }

    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logout thành công" });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================================ FORGOT PASSWORD ================================ */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: "ToyZone - Reset Password",
      html: `
        <h2>Reset Password</h2>
        <p>Mã OTP của bạn là:</p>
        <h1>${otp}</h1>
        <p>OTP có hiệu lực trong 5 phút</p>
      `,
    });

    res.json({ message: "Mã OTP đã được gửi đến email của bạn" });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================================ VERIFY OTP ================================ */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Mã OTP không đúng" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Mã OTP hết hạn" });
    }

    res.json({ message: "Mã OTP hợp lệ" });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ================================ RESET PASSWORD ================================ */
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ message: "Password reset success" });
  } catch (err) {
    res.status(500).json(err);
  }
};
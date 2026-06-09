const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { name, phone, address, bank_name,bank_number} = req.body;
    console.log("BODY:", req.body);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại"
      });
    }

    // cập nhật dữ liệu
    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.bank_name = bank_name ?? user.bank_name;
    user.bank_number = bank_number ?? user.bank_number;
    await user.save();

    const { password, refreshToken, otp, otpExpire, ...userData } = user._doc;

    res.json({
      message: "Cập nhật profile thành công",
      user: userData
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
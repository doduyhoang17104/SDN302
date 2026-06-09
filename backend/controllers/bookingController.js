const Booking = require("../models/Booking");
const Toy = require("../models/Toy");
const transporter = require("../config/email");

// tạo booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      toyId,
      name,
      phone,
      shippingAddress,
      deposit,
    } = req.body;

    const shippingFee = 15000;


    const booking = new Booking({
      userId,
      toyId,
      name,
      phone,
      shippingAddress,
      deposit,
      shippingFee,
      status: "pending",
    });

    const savedBooking = await booking.save();
    await Toy.findByIdAndUpdate(toyId, {
      status: "booked",
    });

    try {
      const toy = await Toy.findById(toyId).populate("owner", "name email phone");

      if (toy?.owner?.email) {
        await transporter.sendMail({
          to: toy.owner.email,
          subject: "ToyZone - Bạn có đơn thuê mới",
          html: `
            <h2>Bạn có đơn thuê mới</h2>
            <p>Xin chào ${toy.owner.name},</p>
            <p>Đồ chơi <strong>${toy.name}</strong> vừa được đặt thuê.</p>
            <ul>
              <li>Tên người thuê: ${name}</li>
              <li>Số điện thoại: ${phone}</li>
              <li>Địa chỉ giao hàng: ${shippingAddress}</li>
              <li>Tiền cọc: ${(deposit).toLocaleString("vi-VN")} đ</li>
            </ul>
            <p>Vui lòng vào hệ thống để duyệt đơn.</p>
          `,
        });
      }
    } catch (mailError) {
      console.error("Send booking notification email failed:", mailError.message);
    }

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi tạo booking",
      error: error.message,
    });
  }
};

// lấy booking của user
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.find({ userId })
      .populate({
        path: "toyId",
        populate: {
          path: "owner",
          select: "name phone bank_name bank_number",
        },
      });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy booking của user",
      error: error.message,
    });
  }
};

// lấy booking của owner
exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const ownerToys = await Toy.find({ owner: ownerId }).select("_id");
    const toyIds = ownerToys.map((toy) => toy._id);

    const bookings = await Booking.find({ toyId: { $in: toyIds } })
      .populate("toyId")
      .populate("userId", "name phone bank_name bank_number");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy booking của owner",
      error: error.message,
    });
  }
};

// cập nhật trạng thái booking
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Không tìm thấy booking",
      });
    }

    // cập nhật status booking
    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // If status changed to completed (e.g. from returned/waiting_refund), make toy available
    if (status === "completed" && oldStatus !== "completed") {
        await Toy.findByIdAndUpdate(booking.toyId, { status: "available" });
    }

    if (booking.status === "rejected" || booking.status === "cancelled") {
      await Toy.findByIdAndUpdate(booking.toyId, { status: "available" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi cập nhật trạng thái",
      error: error.message,
    });
  }
};
exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "toyId",
        populate: {
          path: "owner",
          select: "name phone bank_name bank_number",
        },
      });

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    // Tính toán chi phí trả đồ chơi (chỉ preview)
    const startDate = new Date(booking.createdAt);
    const returnDate = new Date();
    const diffTime = Math.abs(returnDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const weeks = Math.ceil(diffDays / 7);
    
    // Lấy giá thuê từ toy (nếu toy bị xóa thì lấy giá cũ trong booking nếu có lưu, ở đây lấy từ toyId)
    // Lưu ý: nên lưu giá thuê vào booking tại thời điểm tạo để tránh giá toy thay đổi sau này
    // Ở đây ta tạm dùng toy.price
    const rentalPrice = (booking.toyId ? booking.toyId.price : 0) * weeks;
    const totalCost = rentalPrice; // + phí vận chuyển nếu có tính thêm lúc trả

    res.json({
      booking,
      calculation: {
        startDate,
        returnDate,
        diffDays,
        weeks,
        rentalPrice,
        totalCost
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy chi tiết booking",
      error: error.message,
    });
  }
};
exports.returnToy = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { feedback } = req.body || {};

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Không tìm thấy booking",
      });
    }

    if (booking.status !== "approved") {
      return res.status(400).json({
        message: "Đơn này không ở trạng thái đang thuê",
      });
    }

    // ngày bắt đầu thuê
    const startDate = booking.createdAt;

    // ngày trả
    const returnDate = new Date();

    // số ngày thuê
    const diffTime = returnDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // số tuần thuê
    const weeks = Math.ceil(diffDays / 7);

    // lấy giá thuê / tuần từ Toy
    const toy = await Toy.findById(booking.toyId);

    const rentalPrice = toy.price * weeks;

    // cập nhật booking
    booking.price = rentalPrice;
    booking.returnDate = returnDate;
    if (typeof feedback === "string") {
      booking.feedback = feedback.trim();
    }
    
    // Nếu tiền thuê ít hơn tiền cọc, chủ đồ chơi phải trả lại tiền thừa => status = "waiting_refund"
    if (rentalPrice < booking.deposit) {
        booking.status = "waiting_refund"; 
    } else {
        booking.status = "completed";
    }

    await booking.save();

    // mở lại trạng thái đồ chơi
    if (booking.status === "completed") {
       await Toy.findByIdAndUpdate(booking.toyId, { status: "available" });
    }

    res.status(200).json({
      message: "Trả đồ chơi thành công",
      weeks,
      rentalPrice,
      totalPrice: rentalPrice + booking.shippingFee, // Calculated on the fly
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi trả đồ chơi",
      error: error.message,
    });
  }
};

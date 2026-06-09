const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");

// tạo booking
router.post("/", verifyToken, bookingController.createBooking);

// lấy booking của user
router.get("/user/:userId", verifyToken, bookingController.getMyBookings);

// lấy booking của owner
router.get("/owner/:ownerId", verifyToken, bookingController.getOwnerBookings);

// update trạng thái booking
router.put("/:id/status", verifyToken, bookingController.updateBookingStatus);

// lấy chi tiết booking (cho trang trả đồ)
router.get("/:id", verifyToken, bookingController.getBookingDetails);

// trả đồ chơi
router.put("/:bookingId/return", verifyToken, bookingController.returnToy);


module.exports = router;
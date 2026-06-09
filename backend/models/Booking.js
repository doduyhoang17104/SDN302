const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toy",
      required: true,
    },

    // ownerId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },

    feedback: {
      type: String,
      trim: true,
      default: "",
    },
    
    name: String,

    phone: String,

    shippingAddress: String,

    price: Number,

    deposit: Number,

    shippingFee: {
      type: Number,
      default: 15000,
    },

    status: {
      type: String,
      enum: ["pending", "approved","rejected", "completed", "cancelled", "returned", "waiting_refund"],
      default: "pending",
    },
    returnDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);

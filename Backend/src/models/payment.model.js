import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: false,
    default: null,
  },
  price: {

  
  amount: {
    type: Number,
    min: 0,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "INR",
  }
},
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
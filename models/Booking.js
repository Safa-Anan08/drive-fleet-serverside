import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: String,
    carId: String,
    carName: String,
    price: Number,
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);
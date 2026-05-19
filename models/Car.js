import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    type: String,
    image: String,
    seats: Number,
    location: String,
    description: String,
    availableCars: Number,
    mileage: String,

    userId: String,
    userName: String,
    userEmail: String
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
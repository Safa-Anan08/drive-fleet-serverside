import express from "express";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();



router.post("/:carId", protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);

    if (!car || car.availableCars <= 0) {
      return res.status(400).json({
        message: "Car not available",
      });
    }

    const booking = await Booking.create({
  userId: req.user.id,
  carId: car._id,
  carName: car.name,
  price: car.price,
  bookingDate: req.body.date,
  driverNeeded: req.body.driverNeeded,
  location: req.body.location,
});

    car.availableCars -= 1;
    await car.save();

    res.json(booking);
  } catch {
    res.status(500).json({ message: "Booking failed" });
  }
});


router.get("/", protect, async (req, res) => {
  const bookings = await Booking.find({
    userId: req.user.id,
  });

  res.json(bookings);
});



router.delete("/:id", protect, async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found",
    });
  }

  const car = await Car.findById(booking.carId);

  if (car) {
    car.availableCars += 1;
    await car.save();
  }

  await booking.deleteOne();

  res.json({
    message: "Booking cancelled",
  });
});

export default router;
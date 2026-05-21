import express from "express";
import Car from "../models/Car.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch {
     console.log(error);
    res.status(500).json({
      message: "Failed to fetch cars",
    });
  }
});



router.post("/", protect, async (req, res) => {
  try {
    const car = await Car.create({
      ...req.body,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
    });

    res.status(201).json(car);
  } catch {
     console.log(error);
    res.status(500).json({
      message: "Failed to add car",
    });
  }
});



router.get("/my", protect, async (req, res) => {
  try {
    const cars = await Car.find({
      userId: req.user.id,
    });

    res.json(cars);
  } catch {
     console.log(error);
    res.status(500).json({
      message: "Failed to fetch your cars",
    });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
       console.log(error);
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.json(car);
  } catch {
     console.log(error);
    res.status(500).json({
      message: "Failed to fetch car",
    });
  }
});



router.put("/:id", protect, async (req, res) => {
  try {
    const car = await Car.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.json(car);
  } catch {
    res.status(500).json({
      message: "Failed to update car",
    });
  }
});



router.delete("/:id", protect, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.json({
      message: "Deleted successfully",
    });
  } catch {
    res.status(500).json({
      message: "Failed to delete car",
    });
  }
});

export default router;
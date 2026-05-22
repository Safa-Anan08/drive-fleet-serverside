import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password, photo, location } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
     photo,
    location: location || "",
    role: "user"
  });
console.log(req.body);
  res.json(user);
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      location: user.location,
      role: user.role,
    }
  });
});


router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json(user);
});

router.put("/profile", protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      photo: req.body.photo,
      location: req.body.location
    },
    { new: true }
  );

  res.json(user);
});

router.post("/google", async (req, res) => {
  const { name, email, photo } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      photo,
      password: "", 
      location: "",
      role: "user",
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      location: user.location,
      role: user.role,
    },
  });
});


export default router;
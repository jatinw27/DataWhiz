import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/* ===============================
   REGISTER
================================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists)
      return res.status(400).json({
        message: "User already exists",
      });

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

  } catch (err) {
    console.error("Register error: ", err.message);

    if(err.name === "ValidationError"){
      return res.status(400).json({
        message: err.message,
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   LOGIN
================================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

   res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
/* ===============================
   GET CURRENT USER
================================= */
export const getMe = async (req, res) => {
  res.json(req.user);
};
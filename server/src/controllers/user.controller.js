import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.util.js";

export const register = catchAsync(async (req, res) => {
  const { firstName, secondName, username, email, password } = req.body;
  if (!firstName || !secondName || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "firstName, secondName, username, email and password are required",
    });
  }

  const user = await userModel.create({
    firstName,
    secondName,
    username,
    email,
    password,
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: userResponse,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and Password are required" });
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user: userResponse, token },
  });
});

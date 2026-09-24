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

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

// GET CURRENT PROFILE
export const getProfile = catchAsync(async (req, res) => {
  const user = await userModel.findById(req.user.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: user,
  });
});

// UPDATE PROFILE
export const updateProfile = catchAsync(async (req, res) => {
  const { firstName, secondName, username, email } = req.body;

  const updates = {};

  if (firstName !== undefined) updates.firstName = firstName;
  if (secondName !== undefined) updates.secondName = secondName;
  if (username !== undefined) updates.username = username;
  if (email !== undefined) updates.email = email;

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.userId,
    updates,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const userResponse = updatedUser.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: userResponse,
  });
});

// CHANGE PASSWORD
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message:
        "Current password, new password and confirm password are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New passwords do not match",
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters",
    });
  }

  const user = await userModel.findById(req.user.userId).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const match = await bcrypt.compare(currentPassword, user.password);

  if (!match) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// DELETE ACCOUNT
export const deleteAccount = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const ownedProjects = await projectModel
    .find({ owner: userId })
    .select("_id");

  const ownedProjectIds = ownedProjects.map((project) => project._id);

  // Delete tasks inside owned projects
  await taskModel.deleteMany({
    projectId: { $in: ownedProjectIds },
  });

  // Delete tasks assigned to this user
  await taskModel.deleteMany({
    assignedTo: userId,
  });

  // Remove user from other projects' members
  await projectModel.updateMany(
    { members: userId },
    { $pull: { members: userId } },
  );

  // Delete projects owned by this user
  await projectModel.deleteMany({
    owner: userId,
  });

  // Delete account
  await userModel.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await userModel
    .find()
    .select("_id firstName secondName username");

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: users,
  });
});
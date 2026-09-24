import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAllUsers,
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", auth, getProfile);
router.patch("/profile", auth, updateProfile);
router.patch("/change-password", auth, changePassword);
router.delete("/profile", auth, deleteAccount);

router.get("/", auth, getAllUsers);

export default router;

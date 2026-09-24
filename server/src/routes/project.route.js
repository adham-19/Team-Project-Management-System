import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", auth, createProject);

router.get("/", auth, getAllProjects);
router.get("/:id", auth, getProjectById);

router.patch("/:id", auth, updateProject);

router.delete("/:id", auth, deleteProject);

export default router;

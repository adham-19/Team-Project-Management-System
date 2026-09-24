import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} from "../controllers/project.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", auth, createProject);

router.get("/", auth, getAllProjects);
router.get("/:id", auth, getProjectById);

router.patch("/:id", auth, updateProject);

router.delete("/:id", auth, deleteProject);

router.post("/:id/members", auth, addProjectMember);
router.delete("/:id/members/:userId", auth, removeProjectMember);

export default router;

import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/', auth, createTask);

router.get('/', auth, getAllTasks);
router.get('/:id', auth, getTaskById);

router.patch('/:id', auth, updateTask);

router.delete('/:id', auth, deleteTask);

export default router;
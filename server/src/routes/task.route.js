import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post('/', createTask);

router.get('/', getAllTasks);
router.get('/:id', getTaskById);

router.patch('/:id', updateTask);

router.delete('/:id', deleteTask);

export default router;
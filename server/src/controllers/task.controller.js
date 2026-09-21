import taskModel from "../models/task.model.js";
import catchAsync from "../utils/catchAsync.util.js";

export const createTask = catchAsync(async (req, res) => {
  const { title, description, projectId, priority, status } = req.body;
  if (!title || !description || !projectId || !priority) {
    return res.status(400).json({
      success: false,
      message: "Name, Description, ProjectId, Priority are required",
    });
  }

  const task = await taskModel.create({
    title,
    description,
    projectId,
    priority,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

export const getAllTasks = catchAsync(async (req, res) => {
  const tasks = await taskModel.find();

  res.status(200).json({
    success: true,
    message: "Tasks retrieved successfully",
    data: tasks,
  });
});

export const getTaskById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const task = await taskModel.findById(id);
  if (!task) {
    return res
      .status(404)
      .json({ success: false, message: "No task found with this id" });
  }

  res.status(200).json({
    success: true,
    message: "Task details retrieved successfully",
    data: task,
  });
});

export const updateTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title, description, projectId, priority, status } = req.body;

  const updatedTask = await taskModel.findByIdAndUpdate(
    id,
    { title, description, projectId, priority, status },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  if (!updatedTask) {
    return res
      .status(404)
      .json({ success: false, message: "No task found with this id" });
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
});

export const deleteTask = catchAsync(async (req, res) => {
  const { id } = req.params;

  const task = await taskModel.findByIdAndDelete(id);
  if (!task) {
    return res
      .status(404)
      .json({ success: false, message: "No task found with this id" });
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: task,
  });
});

import projectModel from "../models/project.model.js";
import taskModel from "../models/task.model.js";
import userModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.util.js";

export const createTask = catchAsync(async (req, res) => {
  const { title, description, projectId, assignedTo, priority, status } =
    req.body;
  if (!title || !description || !projectId || !priority || !assignedTo) {
    return res.status(400).json({
      success: false,
      message:
        "Title, Description, ProjectId, Priority, AssignedTo are required",
    });
  }

  const project = await projectModel.findById(projectId);
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "Project Not Found" });
  }

  if (project.owner.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const user = await userModel.findById(assignedTo);
  if (!user) {
    return res.status(404).json({ success: false, message: "User Not Found" });
  }

  if (!project.members.some((m) => m.toString() === assignedTo)) {
    return res.status(400).json({
      success: false,
      message: "This member doesn't belong to this project",
    });
  }

  const task = await taskModel.create({
    title,
    description,
    assignedTo,
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
  const { projectId } = req.query;

  let tasks;

  if (projectId) {
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project Not Found",
      });
    }

    const isMember = project.members.some(
      (member) => member.toString() === req.user.userId,
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    tasks = await taskModel.find({ projectId });
  } else {
    tasks = await taskModel.find({
      assignedTo: req.user.userId,
    });
  }

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

  const project = await projectModel.findById(task.projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "No project found with this id",
    });
  }

  if (!project.members.some((m) => m.toString() === req.user.userId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  res.status(200).json({
    success: true,
    message: "Task details retrieved successfully",
    data: task,
  });
});

export const updateTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title, description, assignedTo, priority, status } = req.body;

  const task = await taskModel.findById(id);
  if (!task) {
    return res
      .status(404)
      .json({ success: false, message: "No task found with this id" });
  }

  const project = await projectModel.findById(task.projectId);
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "No project found with this id" });
  }

  if (project.owner.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (assignedTo) {
    const user = await userModel.findById(assignedTo);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    if (!project.members.some((m) => m.toString() === assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "This member doesn't belong to this project",
      });
    }
  }

  const updatedTask = await taskModel.findByIdAndUpdate(
    id,
    { title, description, assignedTo, priority, status },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
});

export const deleteTask = catchAsync(async (req, res) => {
  const { id } = req.params;

  const task = await taskModel.findById(id);
  if (!task) {
    return res
      .status(404)
      .json({ success: false, message: "No task found with this id" });
  }

  const project = await projectModel.findById(task.projectId);
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "No project found with this id" });
  }

  if (project.owner.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  await taskModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: task,
  });
});

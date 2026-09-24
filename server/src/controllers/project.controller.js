import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.util.js";

export const createProject = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Name and Description are requried" });
  }

  const project = await projectModel.create({
    name,
    description,
    owner: req.user.userId,
    members: [req.user.userId],
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

export const getAllProjects = catchAsync(async (req, res) => {
  const projects = await projectModel.find();

  const filteredProjects = projects.filter((p) => {
    return p.members.some((m) => m.toString() === req.user.userId);
  });

  res.status(200).json({
    success: true,
    message: "Projects retrieved successfully",
    data: filteredProjects,
  });
});

export const getProjectById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const project = await projectModel.findById(id);
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "No project found with this id" });
  }

  if (!project.members.some((m) => m.toString() === req.user.userId)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  res.status(200).json({
    success: true,
    message: "Project details retrieved successfully",
    data: project,
  });
});

export const updateProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const project = await projectModel.findById(id);
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "No project found with this id" });
  }

  if (project.owner.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const updatedProject = await projectModel.findByIdAndUpdate(
    id,
    { name, description },
    { returnDocument: "after", runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: updatedProject,
  });
});

export const deleteProject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const project = await projectModel.findById(id);
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "No project found with this id" });
  }

  if (project.owner.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  await projectModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
    data: project,
  });
});

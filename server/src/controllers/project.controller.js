import projectModel from "../models/project.model.js";
import catchAsync from "../utils/catchAsync.util.js";

export const createProject = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Name and Description are requried" });
  }

  // owner will be after that took from token after authentication

  const project = await projectModel.create({
    name,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

export const getAllProjects = catchAsync(async (req, res) => {
  const projects = await projectModel.find();

  res.status(200).json({
    success: true,
    message: "Projects retrieved successfully",
    data: projects,
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

  res.status(200).json({
    success: true,
    message: "Project details retrieved successfully",
    data: project,
  });
});

export const updateProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updatedProject = await projectModel.findByIdAndUpdate(
    id,
    { name, description },
    { returnDocument: "after", runValidators: true },
  );
  if (!updatedProject) {
    return res
      .status(404)
      .json({ success: false, message: "No project found with this id" });
  }

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: updatedProject,
  });
});

export const deleteProject = catchAsync(async (req, res) => {
  const { id } = req.params;

  const project = await projectModel.findByIdAndDelete(id);
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: "No project found with this id" });
  }

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
    data: project,
  });
});

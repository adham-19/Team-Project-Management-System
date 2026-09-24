import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.util.js";
import taskModel from "../models/task.model.js";

const userMatchesMember = (member, userId) => {
  const memberId = member?._id ? member._id.toString() : member?.toString();
  return memberId === userId;
};

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
    return p.members.some((member) =>
      userMatchesMember(member, req.user.userId),
    );
  });

  res.status(200).json({
    success: true,
    message: "Projects retrieved successfully",
    data: filteredProjects,
  });
});

export const getProjectById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const project = await projectModel
    .findById(id)
    .populate("members", "firstName secondName username email");

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "No project found with this id",
    });
  }

  const isMember = project.members.some((member) =>
    userMatchesMember(member, req.user.userId),
  );

  if (!isMember) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
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
export const addProjectMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "UserId is required",
    });
  }

  const project = await projectModel.findById(id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project Not Found",
    });
  }

  if (project.owner.toString() !== req.user.userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }

  const isAlreadyMember = project.members.some(
    (member) => member.toString() === userId,
  );

  if (isAlreadyMember) {
    return res.status(409).json({
      success: false,
      message: "User is already a project member",
    });
  }

  project.members.push(userId);

  await project.save();

  await project.populate("members", "firstName secondName username email");

  res.status(200).json({
    success: true,
    message: "Member added successfully",
    data: project,
  });
});

export const removeProjectMember = catchAsync(async (req, res) => {
  const { id, userId } = req.params;

  const project = await projectModel.findById(id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project Not Found",
    });
  }

  if (project.owner.toString() !== req.user.userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  const isMember = project.members.some(
    (member) => member.toString() === userId,
  );

  if (!isMember) {
    return res.status(404).json({
      success: false,
      message: "User is not a project member",
    });
  }

  if (project.owner.toString() === userId) {
    return res.status(400).json({
      success: false,
      message: "Project owner cannot be removed",
    });
  }

  const assignedTask = await taskModel.exists({
    projectId: id,
    assignedTo: userId,
  });

  if (assignedTask) {
    return res.status(400).json({
      success: false,
      message:
        "Cannot remove this member while they have assigned tasks. Reassign their tasks first.",
    });
  }

  project.members = project.members.filter(
    (member) => member.toString() !== userId,
  );

  await project.save();

  await project.populate("members", "firstName secondName username email");

  res.status(200).json({
    success: true,
    message: "Member removed successfully",
    data: project,
  });
});

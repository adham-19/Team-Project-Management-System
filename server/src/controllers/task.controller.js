import taskModel from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, priority, status } = req.body;

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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find();

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskModel.findById(id);

    res.status(200).json({
      success: true,
      message: "Task details retrieved successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

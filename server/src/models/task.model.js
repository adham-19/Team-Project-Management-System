import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "title is very small"],
      maxlength: [100, "title is very big"],
    },
    description: {
      type: String,
      required: true,
      minlength: [10, "description is very small"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      //required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("task", taskSchema);

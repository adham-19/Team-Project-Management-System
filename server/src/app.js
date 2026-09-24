import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// ROUTE IMPORTS
import projectRouter from "./routes/project.route.js";
import taskRouter from "./routes/task.route.js";
import userRouter from "./routes/user.route.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

// error handlers
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Page Not Found" });
});
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    res.status(400).json({ success: false, message: "ID is invalid" });
  } else if (err.name === "ValidationError") {
    res.status(400).json({ success: false, message: err.message });
  } else if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    res.status(409).json({ success: false, message: `This ${duplicateField} is already exist`});
  } else {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// MongoDB Connect
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("DB connected");

    // listen
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

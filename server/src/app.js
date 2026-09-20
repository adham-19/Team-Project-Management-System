import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// ROUTE IMPORTS
import projectRouter from "./routes/project.route.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/projects", projectRouter);

// error handlers
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Page Not Found" });
});
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: "Internal Server Error" });
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

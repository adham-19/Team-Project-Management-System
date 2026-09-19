import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get("/test", (req, res) => {
  res.send("test work successfully");
});

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
    const PORT = process.env.PORT | 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

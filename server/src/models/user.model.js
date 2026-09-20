import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "firstName is very small"],
      maxlength: [100, "firstName is very big"],
    },
    secondName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "secondName is very small"],
      maxlength: [100, "secondName is very big"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [2, "username is very small"],
      maxlength: [100, "username is very big"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      requried: true,
      select: false,
      minlength: [8, "password is very small"],
      maxlength: [100, "password is very big"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("user", userSchema);

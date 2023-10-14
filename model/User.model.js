import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    trim: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: "",
  },
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);

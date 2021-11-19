import mongoose from "mongoose";

// create user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  role: {
    type: String,
    default: "user",
  },
});

// create user model
const User = mongoose.model("User", userSchema);

export default User;

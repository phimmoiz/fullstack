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
    default: "/assets/images/question.png",
  },
  role: {
    type: String,
    default: "user",
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.setLastLogin = function () {
  this.lastLogin = Date.now();
  return this.save();
};

userSchema.methods.isOnline = function () {
  return this.lastLogin.getTime() + 1000 * 60 * 5 > Date.now();
};

// create user model
const User = mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";
import { comparePassword } from "../../utils/";
import Randomstring from "randomstring";

// create user schema
let userSchema = new mongoose.Schema({
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
  banned: {
    type: Boolean,
    default: false,
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
    default: null,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  activationToken: {
    type: String,
    default: Randomstring.generate(),
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

userSchema.methods.setLastLogin = function () {
  this.lastLogin = Date.now();
  return this.save();
};

userSchema.methods.isOnline = function () {
  if (!this.lastLogin) return false;

  return this.lastLogin.getTime() + 1000 * 60 * 5 > Date.now();
};

//add check password function

userSchema.methods.checkPassword = function (password) {
  return comparePassword(password, this.password);
};

// create user model
const User = mongoose.model("User", userSchema);

export default User;

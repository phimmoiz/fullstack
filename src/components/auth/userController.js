import { create } from "hbs";
import User from "./userModel";

export const getUser = async (req, res) => {
  const { name } = req.query;

  const user = await User.findOne({ username: name });

  if (user) {
    res.json({
      user: user.username,
      email: user.email,
      id: user._id,
    });
    return;
  }

  res.json({
    success: false,
    message: "User not found",
  });
};

export const getActivate = async (req, res) => {
  const { email, token } = req.query;

  const user = await User.findOne({ email, activationToken: token });

  if (user) {
    user.isActivated = true;
    user.activationToken = undefined;
    await user.save();
    res.json({
      success: true,
      message: "Xác thực thành công",
    });
    return;
  }

  res.json({
    success: false,
    message: "Xác thực thất bại",
  });
};

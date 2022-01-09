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

  const user = await User.findOne({ email });

  if (user) {
    if (user.activationToken === token) {
      user.isActivated = true;
      user.activationToken = undefined;
      res.render("auth/views/activate", {
        title: `Kích hoạt tài khoản | ${email}`,
        success: true,
        message: "Xác thực tài khoản thành công",
      });
      return;
    }
    if (user.isActivated) {
      res.render("auth/views/activate", {
        title: `Kích hoạt tài khoản | ${email}`,
        success: true,
        message: "Tài khoản đã được kích hoạt",
      });
      return;
    }
  }

  const error = "token không hợp lệ";
  if (!user) {
    error = "Tài khoản không tồn tại";
  }


  res.render("auth/views/activate", {
    title: `Kích hoạt tài khoản | ${email}`,
    success: false,
    error: error,
    message: "Xác thực tài khoản thất bại",
  });

};

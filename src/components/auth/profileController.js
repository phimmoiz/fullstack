import User from "./userModel.js";
import { hashPassword } from "../../utils/";

export const getProfile = async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render("auth/views/profile/info", {
    title: `${user.username} | Trang cá nhân`,
    user,
  });
};

export const postChangePwd = async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(userId);

    // Check old password hash
    const isMatch = await user.checkPassword(oldPassword);

    if (!isMatch) {
      throw new Error("Mật khẩu cũ không chính xác");
    }

    if (newPassword != confirmPassword) {
      throw new Error("Mật khẩu mới không khớp");
    }

    // regex for password validation length >= 6 
    const regex = /^[a-zA-Z0-9]{6,}$/;
    if (!regex.test(newPassword)) {
      throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
    }

    // hash password
    user.password = await hashPassword(newPassword);
    await user.save();

    res.render("auth/views/profile/info", {
      title: `${user.username} | Trang cá nhân`,
      message: "Đổi mật khẩu thành công",
      user,
    });

  } catch (error) {
    return res.render("auth/views/profile/changepwd", {
      title: "Đổi mật khẩu",
      success: false,
      error: error.message,
    });
  }
};

export const getInfo = async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render("auth/views/profile/info", {
    title: `${user.username} | Thông tin cá nhân`,
    user,
  });
};

export const getChangePwd = async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render("auth/views/profile/changepwd", {
    title: `${user.username} | Đổi mật khẩu`,
    user,
  });
};

export const getTermPolicy = async (req, res) => {
  const userId = res.locals.user.id;
  const user = await User.findById(userId);
  res.render("auth/views/profile/term_policy", {
    title: `${user.username} | Điều khoản sử dụng`,
    user,
  });
};

export const getActivate = async (req, res) => {
  const userId = res.locals.user.id;
  const user = await User.findById(userId);
  res.render("auth/views/profile/activation", {
    title: `${user.username} | Kích hoạt tài khoản`,
    user,
  });
};

export const postUpdateFullname = async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const { fullname } = req.body;

    const user = await User.findById(userId);
    user.fullname = fullname;
    await user.save();

    res.json({
      success: true,
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

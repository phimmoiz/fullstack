import User from "./userModel.js";
import createError from "http-errors";
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

    if (user.password != oldPassword) {
      throw new Error("Mật khẩu cũ không chính xác");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("Mật khẩu mới không khớp");
    }

    // check new password regex
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(newPassword)) {
      throw new Error(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      );
    }

    user.password = hashPassword(newPassword);
    await user.save();

    res.render("auth/views/profile/info", {
      title: `${user.username} | Trang cá nhân`,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    next(createError(500, error.message));
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

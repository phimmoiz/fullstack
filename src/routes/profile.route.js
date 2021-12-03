import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import User from "../components/auth/userModel.js";
import createError from "http-errors";

const router = Router();

router.use(requireAuth);
router.get("/", async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render("auth/views/profile/index", {
    title: `${user.username} | Trang cá nhân`,
    user,
  });
});

router.post("/changepwd", async (req, res, next) => {
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

    //TODO: check password length

    user.password = newPassword;
    await user.save();

    res.render("auth/views/profile/info", {
      title: `${user.username} | Trang cá nhân`,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    next(createError(500, error.message));
  }
});

router.get("/info", async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render("auth/views/profile/info", {
    title: `${user.username} | Thông tin cá nhân`,
    user,
  });
});

router.get("/changepwd", async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render("auth/views/profile/changepwd", {
    title: `${user.username} | Đổi mật khẩu`,
    user,
  });
});

router.get("/term_policy", async (req, res) => {
  const userId = res.locals.user.id;
  const user = await User.findById(userId);
  res.render("auth/views/profile/term_policy", {
    title: `${user.username} | Điều khoản sử dụng`,
    user,
  });
});

export default router;

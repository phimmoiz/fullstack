import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
const router = Router();

router.use(requireAuth);
router.get("/", async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render("profile/index", {
    title: `${user.username} | Trang cá nhân`,
    user,
  });
});

router.get('/info', async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render('profile/info', {
    title: `${user.username} | Thông tin cá nhân`,
    user,
  });
});

router.get('/changepwd', async (req, res) => {
  const userId = res.locals.user.id;

  const user = await User.findById(userId);

  res.render('profile/changepwd', {
    title: `${user.username} | Đổi mật khẩu`,
    user,
  });
});

router.get('/term_policy', async (req, res) => {
  const userId = res.locals.user.id;
  const user = await User.findById(userId);
  res.render('profile/term_policy', {
    title: `${user.username} | Điều khoản sử dụng`,
    user,
  });
});

export default router;

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

export default router;

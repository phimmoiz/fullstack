import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("auth/views/register", { title: "Đăng ký" });
});

export default router;

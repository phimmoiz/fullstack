import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("signup", { title: "Đăng ký" });
});

export default router;

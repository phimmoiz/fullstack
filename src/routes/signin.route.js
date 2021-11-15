import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("signin", { title: "Đăng nhập" });
});

export default router;

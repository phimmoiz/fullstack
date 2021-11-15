import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("signup", "Đăng ký");
});

export default router;

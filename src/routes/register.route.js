import { Router } from "express";
import { createUser } from "../components/auth/user.controller";
const router = Router();

router.get("/", (req, res) => {
  res.render("auth/views/register", { title: "Đăng ký" });
});

router.post("/", createUser);

export default router;

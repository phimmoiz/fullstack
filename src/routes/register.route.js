import { Router } from "express";
import { create } from "hbs";
import { createUser } from "../controllers/user.controller";
const router = Router();

router.get("/", (req, res) => {
  res.render("auth/views/register", { title: "Đăng ký" });
});

router.post("/", createUser);

export default router;

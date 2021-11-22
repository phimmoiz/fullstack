import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  res.clearCookie("token");

  res.redirect("/");
});

export default router;

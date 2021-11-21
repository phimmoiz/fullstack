import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// use authMiddleware to check if user is logged in
router.use(requireAuth);

router.get("/", (req, res) => {
  res.render("admin/index", { title: "Admin" });
});

export default router;

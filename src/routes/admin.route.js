import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import Category from "../models/category.model";

const router = Router();

// use authMiddleware to check if user is logged in
router.use(requireAdmin);

router.get("/", async (req, res) => {
  // get all category
  const categories = await Category.find({});

  res.render("admin/index", { title: "Admin", categories });
});

export default router;

import { Router } from "express";
import Category from "../models/category.model";
import { requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAdmin);

router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const { title, description, slug } = req.body;

    // create category
    const newCat = await Category.create({
      title,
      description,
      slug,
    });

    // res.json({ success: true, data: newCat });

    res.redirect("/admin/");
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

export default router;

import { Router } from "express";
import Category from "../models/category.model";
import { requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("*", requireAdmin);

router.post("/", async (req, res) => {
  // console.log(req.body);

  try {
    const { title, description, slug } = req.body;

    // create category
    const newCat = await Category.create({
      title,
      description,
      slug,
    });

    res.json({ success: true, data: newCat });

    // res.render("/admin/index", {
    //   title: "Admin Panel",
    //   data: newCat,
    // });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find().populate("movies");

    res.render("categories/index", {
      title: "Danh sách chuyên mục",
      categories,
    });
  } catch (err) {
    next(createError(403, err));
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;

    const cat = await Category.findOne({ slug });

    // if not found
    if (!cat) {
      throw new Error("Category not found");
    }

    res.json({ success: true, data: cat });
  } catch (err) {
    // 404
    next();
  }
});
export default router;

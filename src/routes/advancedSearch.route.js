import { Router } from "express";
import Category from "../components/movies/categoryModel";

const router = Router();

router.get("/", async (req, res) => {
  // get categories
  const categories = await Category.find({}).lean();

  console.log(categories);

  res.render("movies/views/tim-kiem-nang-cao", {
    title: "Tìm kiếm nâng cao",
    categories,
  });
});

export default router;

import { Router } from "express";
import Category from "../models/category.model";

const router = Router();

router.get("/", async (req, res) => {
  // get categories
  const categories = await Category.find({}).lean();

  console.log(categories);

  res.render("danh-sach", { title: "Danh sách phim", categories });
});

export default router;

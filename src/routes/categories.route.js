import { Router } from "express";
import Category from "../components/movies/categoryModel";
import { requireAdmin } from "../middlewares/auth.middleware";
import createError from "http-errors";
import Movie from "../components/movies/movieModel";

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

    res.render("movies/views/categories/index", {
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    const cat = await Category.findOne({ slug });

    const populated = await cat.populate({
      path: "movies",
      model: Movie,
      options: {
        sort: { createdAt: -1 },
        limit,
        skip: (page - 1) * limit,
      },
    });

    const totalMovies = await cat.__v;

    // if not found
    if (!cat) {
      throw new Error("Category not found");
    }

    // get total pages
    const totalPages = Math.ceil(totalMovies / 10);

    const pagination = Array.from({ length: totalPages }, (_, i) => i + 1).map(
      (page) => {
        return {
          url: `/categories/${cat.slug}?page=${page}`,
          number: page,
        };
      }
    );

    res.render("movies/views/categories/singleCategory", {
      title: cat.title,
      category: populated,
      pagination,
      currentIndex: page - 1,
    });
  } catch (err) {
    // 404
    next(createError(404, err));
  }
});
export default router;

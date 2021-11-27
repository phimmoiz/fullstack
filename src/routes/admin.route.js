import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import Category from "../models/category.model";
import Movie from "../models/movie.model";
import User from "../models/user.model";

const router = Router();

// use authMiddleware to check if user is logged in
router.use(requireAdmin);

router.get("/", async (req, res) => {
  // get user count, category count, movie count
  const [users, categories, movies] = await Promise.all([
    User.countDocuments(),
    Category.countDocuments(),
    Movie.countDocuments(),
  ]);

  res.render("admin/index", {
    title: "Admin",
    count: { users, categories, movies },
  });
});

router.get("/users", async (req, res) => {
  // get all users
  const users = await User.find({});

  res.render("admin/users", { title: "Admin", users });
});

router.get("/movies/", async (req, res) => {
  // get all movies
  const movies = await Movie.find({});

  res.render("admin/movies", { title: "Admin", movies });
});

router.get("/categories", async (req, res) => {
  // get all categories
  const categories = await Category.find({});

  res.render("admin/categories", { title: "Admin", categories });
});

export default router;

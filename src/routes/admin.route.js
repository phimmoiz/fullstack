import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import Category from "../models/category.model";
import Movie from "../models/movie.model";
import User from "../models/user.model";
import Season from "../models/season.model";
import Episode from "../models/episode.model";

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const error = req.session?.error; 

  // get all category then populate movies, season, episode
  const categories = await Category.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: "movies",
      model: Movie,
      populate: [
        {
          path: "seasons",
          model: Season,
          populate: {
            path: "episodes",
            model: Episode,
          },
        },
      ],
    });

  // get movie count
  const movieCount = await Movie.countDocuments();

  res.render("admin/movies", {
    title: "Admin",
    categories,
    movieCount,
    csrfToken: req.csrfToken(),
    error,
  });
});

router.get("/movies/:slug", async (req, res) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug }).populate({
      path: "seasons",
      model: Season,
      populate: {
        path: "episodes",
        model: Episode,
      },
    });

    if (!movie) throw new Error("Movie not found");

    res.render("admin/movie", {
      title: "Admin",
      movie,
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    res.redirect("/admin/movies");
  }
});

router.get("/movies/:slug/edit", async (req, res) => {
  const { slug } = req.params;

  try {
    const movie = await Movie.findOne({ slug }).populate({
      path: "seasons",
      model: Season,
      populate: {
        path: "episodes",
        model: Episode,
      },
    });

    if (!movie) throw new Error("Movie not found");

    res.render("admin/movie-edit", {
      title: "Admin",
      movie
    });
  }
  catch (err) {
    req.session.error = err.message;
    res.redirect("/admin/movies");
  }
});

router.post("/movies/:slug", async (req, res) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug });

    if (!movie) throw new Error("Movie not found");

    const { title, description, year, rating, duration, trailer } = req.body;

    await Movie.findByIdAndUpdate(movie._id, {
      title,
      description,
      year,
      rating,
      duration,
      trailer,
    });

    res.render("admin/movie", {
      title: "Admin",
      movie,
      csrfToken: req.csrfToken(),
      success: "Movie updated successfully",
    });
  } catch (err) {
    res.redirect("/admin/movies");
  }
});

router.get("/categories", async (req, res) => {
  // get all categories
  const categories = await Category.find({});

  res.render("admin/categories", { title: "Admin", categories });
});

export default router;

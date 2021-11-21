import { Router } from "express";
import Movie from "../models/movie.model";
import Category from "../models/category.model";
import { requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAdmin);

router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    const { title, description, releaseYear, slug, categories } = req.body;

    // create movie
    // const newMovie = await Movie.create({
    //   title,
    //   description,
    //   slug,
    //   releaseYear,
    //   category,
    // });

    // create movie with mongoose
    const newMovie = await Movie.create({
      title,
      description,
      slug,
      releaseYear,
      // category as array
      categories,
    });

    console.log(newMovie);
    // res.json({ success: true, data: newCat });

    res.redirect("/admin/");
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  const movie = await Movie.findOne({ slug });

  // populate categories
  const test = await movie.populate({ path: "categories", model: Category });

  res.json({ success: true, data: test });

  // res.render("movie", { movie });
});
export default router;

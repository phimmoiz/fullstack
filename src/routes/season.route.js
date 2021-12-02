import express from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import Season from "../models/season.model";
import Episode from "../models/episode.model";
import Movie from "../models/movie.model";

const router = express.Router();

router.get("/:slug/:name", requireAdmin, async (req, res, next) => {
  try {
    const { slug, name } = req.params;

    const movie = await Movie.findOne({ slug }).populate({
      path: "seasons",
      model: Season,
    });

    if (!movie) {
      throw new Error("Movie not found");
    }

    const season = movie.seasons.find((s) => s.name === name);

    // const season = await Season.findOne({ slug, name }).populate({
    //   path: "episodes",
    //   model: Episode,
    // });

    if (!season) throw new Error("Season not found");

    res.status(200).json(season);
  } catch (error) {
    next(createError(404, error.message));
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { name, movie } = req.body;

    const season = new Season({ name, movie });

    await season.save();

    const { slug } = await Movie.findOne({ _id: movie });

    // res.status(201).json({ success: true, season });

    res.redirect(`/admin/movies/${slug}/edit`);
  } catch (err) {
    next(err);
  }
});

router.delete("/:slug/:seasonSlug", requireAdmin, async (req, res, next) => {
  try {
    const { slug, seasonSlug } = req.params;

    const movie = await Movie.findOne({ slug }).populate({
      path: "seasons",
      model: Season,
    });

    const season = movie.seasons.find((s) => s.slug === seasonSlug);

    if (!season) throw new Error("Season not found");

    await season.remove();

    if (!season) {
      throw new Error("Season not found");
    }

    res.status(200).json({ success: true, season });
  } catch (err) {
    next(err);
  }
});

router.put("/:slug", requireAdmin, async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    const season = await Season.findOneAndUpdate(
      { slug },
      { name },
      { new: true }
    );

    if (!season) {
      throw new Error("Season not found");
    }

    res.status(200).json(season);
  } catch (err) {
    next(err);
  }
});

// router.get("/createAllSeason", requireAdmin, async (req, res, next) => {
//   try {
//     // find movies that has no season
//     const movies = await Movie.find({ seasons: { $size: 0 } });

//     // create season for each movie
//     for (let i = 0; i < movies.length; i++) {
//       const { _id, name } = movies[i];

//       const season = new Season({ name: "Season 1", movie: _id });

//       await season.save();
//     }

//     res.status(200).json({ success: true });
//   } catch (err) {
//     next(err);
//   }
// });

export default router;

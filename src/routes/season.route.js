import express from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  getSeason,
  postSeason,
  deleteSeason,
  putSeason,
} from "../components/movies/seasonController";
const router = express.Router();

router.get("/:slug/:name", requireAdmin, getSeason);

router.post("/", requireAdmin, postSeason);

router.delete("/:slug/:seasonSlug", requireAdmin, deleteSeason);

router.put("/:slug", requireAdmin, putSeason);

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

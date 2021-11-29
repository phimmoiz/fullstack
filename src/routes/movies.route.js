import { Router } from "express";
import Movie from "../models/movie.model";
import Category from "../models/category.model";
import { requireAdmin } from "../middlewares/auth.middleware";
import createError from "http-errors";
import {
  postMovie,
  getSingleMovie,
  getMovies,
  getTopMovies,
  getSeason,
  getEpisode,
} from "../controllers/movies.controller";

const router = Router();

router.post("/", requireAdmin, postMovie);

router.get("/", getMovies);
router.get("/ranking", getTopMovies);
router.get("/:slug/season/", getSeason);
router.get("/:slug/season-:season/episode-:episode/", getEpisode);
router.get("/:slug", getSingleMovie);

export default router;

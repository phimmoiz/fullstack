import { Router } from "express";
import Movie from "../components/movies/movie.model";
import Category from "../components/movies/category.model";
import { requireAdmin } from "../middlewares/auth.middleware";
import createError from "http-errors";
import {
  postMovie,
  getSingleMovie,
  getMovies,
  getTopMovies,
  getSeason,
  getEpisode,
  editMovie,
  deleteMovie,
} from "../components/movies/movies.controller";

const router = Router();

router.post("/", requireAdmin, postMovie);

router.get("/", getMovies);
router.get("/ranking", getTopMovies);
router.get("/:slug/season/", getSeason);
router.get("/:slug/:season/episode-:episode/", getEpisode);
router.get("/:slug", getSingleMovie);
router.post("/:slug/edit", requireAdmin, editMovie);
router.post("/:slug/delete", requireAdmin, deleteMovie);
export default router;

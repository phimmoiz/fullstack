import { Router } from "express";
import Movie from "../models/movie.model";
import Category from "../models/category.model";
import { requireAdmin } from "../middlewares/auth.middleware";
import createError from "http-errors";
import {
  createMovie,
  getMovie,
  getMovies,
} from "../controllers/movies.controller";

const router = Router();

router.use(requireAdmin);

router.post("/", createMovie);
router.get("/", getMovies);
router.get("/:slug", getMovie);

export default router;

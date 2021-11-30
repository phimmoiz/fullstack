import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  getAdmin,
  getUserPanel,
  moviePanelEditMovie,
  moviePanelGetIndex,
  moviePanelGetMovie,
  moviePanelPostMovie,
  getCategoriesPanel,
} from "../controllers/admin.controller";

const router = Router();

// use authMiddleware to check if user is logged in
router.use(requireAdmin);

router.get("/", getAdmin);

router.get("/users", getUserPanel);

router.get("/movies/", moviePanelGetIndex);

router.get("/movies/:slug", moviePanelGetMovie);

router.get("/movies/:slug/edit", moviePanelEditMovie);

router.post("/movies/:slug", moviePanelPostMovie);

router.get("/categories", getCategoriesPanel);

export default router;

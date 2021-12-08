import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  getAdmin,
  getAdminPanel,
  getUserPanel,
  moviePanelEditMovie,
  moviePanelGetIndex,
  moviePanelGetMovie,
  moviePanelPostMovie,
  getCategoriesPanel,
  moviePanelEditSeason,
  createAdmin,
  banUser,
  makeAdmin,
} from "../components/admin/admin.controller";

const router = Router();

// use authMiddleware to check if user is logged in
router.use(requireAdmin);

router.get("/", getAdmin);

router.get("/admins", getAdminPanel);

router.get("/users", getUserPanel);

router.get("/movies/", moviePanelGetIndex);

router.get("/movies/:slug", moviePanelGetMovie);

router.get("/movies/:slug/edit", moviePanelEditMovie);

router.get("/movies/:slug/season/:seasonSlug", moviePanelEditSeason);

router.post("/movies/:slug", moviePanelPostMovie);

router.get("/categories", getCategoriesPanel);

router.post("/createAdmin", createAdmin);

router.post("/admins/make", makeAdmin);

router.post("/admins/ban", banUser);
export default router;

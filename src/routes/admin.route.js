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
  makeAdmin,
  banUser,
  infoUser,
  makeUser,
} from "../components/admin/adminController";

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

router.post("/admins/makeAdmin", makeAdmin);

router.post("/admins/ban", banUser);

router.get("/users/:username", infoUser);

router.post("/admins/makeUser", makeUser);
export default router;

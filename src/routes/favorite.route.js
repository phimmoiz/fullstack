import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";

import { 
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../components/auth/favoriteController";
const router = Router();

router.get("/", getFavorites);

router.post("/", requireAuth, addFavorite);

router.delete("/", removeFavorite);
export default router;

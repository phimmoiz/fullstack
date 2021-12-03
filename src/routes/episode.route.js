import express from "express";
import { requireAdmin } from "../middlewares/auth.middleware";
import {
  getEpisode,
  postEpisode,
  putEpisode,
  deleteEpisode,
} from "../components/movies/episode.controller";

const router = express.Router();

router.get("/:id", getEpisode);
router.post("/", requireAdmin, postEpisode);
router.put("/:id", requireAdmin, putEpisode);
router.delete("/:id", requireAdmin, deleteEpisode);

export default router;

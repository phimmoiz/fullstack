import { Router } from "express";
import {
  postComment,
  getFilmComments,
  deleteComment,
  increaseLikeCount,
} from "../components/movies/commentController";
import { requireAuth } from "../middlewares/auth.middleware";
const router = Router();

router.post("/:slug", requireAuth, postComment);
router.post("/:id/like", requireAuth, increaseLikeCount);
router.get("/:slug", getFilmComments);
router.delete("/:id", deleteComment);
// router.put("/:slug", putComment);

export default router;

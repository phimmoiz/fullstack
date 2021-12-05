import { Router } from "express";
import { postComment, getFilmComments, deleteComment, putComment, increaseLikeCount, replyComment } from "../controllers/comment.controller";
import { requireAuth } from "../middlewares/auth.middleware";
const router = Router();

router.post("/:slug", requireAuth, postComment);
router.post("/:id/like", requireAuth, increaseLikeCount);
router.post("/:id/reply", requireAuth, replyComment);
router.get("/:slug", getFilmComments);
router.delete("/slug", deleteComment);
router.put("/:slug", putComment);

export default router;
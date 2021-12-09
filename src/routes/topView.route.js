import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("movies/views/topluotxem", { title: "Top lượt xem" });
});

export default router;

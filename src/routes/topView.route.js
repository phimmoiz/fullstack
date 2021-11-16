import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("topluotxem", { title: "Top lượt xem" });
});

export default router;

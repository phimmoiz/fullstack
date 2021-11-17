import { Router } from "express";

const router = Router();

router.get("/thong-tin", (req, res) => {
  res.render("phim/thong-tin", { title: "Danh sách phim" });
});

router.get("/xem-phim", (req, res) => {
  res.render("phim/xem-phim", { title: "Xem phim" });
});

export default router;

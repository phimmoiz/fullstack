import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("shop/index", { title: "Shop" });
});

export default router;

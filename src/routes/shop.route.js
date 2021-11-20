import { Router } from "express";
import { getGioHang } from "../controllers/shop.controller";

const router = Router();

router.get("/", (req, res) => {
  res.render("shop/index", { title: "Shop" });
});

router.get("/gio-hang", getGioHang);

export default router;

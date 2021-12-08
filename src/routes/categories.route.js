import { Router } from "express";
import { requireAdmin } from "../middlewares/auth.middleware";

import { 
  addCategory, 
  getCategories, 
  pagingCategories
} from "../components/movies/categoryController";

const router = Router();

router.post("*", requireAdmin);

router.post("/", addCategory);

router.get("/", getCategories);

router.get("/:slug", pagingCategories);
export default router;

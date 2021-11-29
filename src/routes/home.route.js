import { Router } from "express";
import { getHomePage } from "../controllers/home.controller";

const router = Router();

router.get("/", getHomePage);

export default router;

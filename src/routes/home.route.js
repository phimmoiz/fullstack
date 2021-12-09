import { Router } from "express";
import { getHomePage } from "../components/movies/homeController";

const router = Router();

router.get("/", getHomePage);

export default router;

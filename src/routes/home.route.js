import { Router } from "express";
import { getHomePage } from "../components/movies/home.controller";

const router = Router();

router.get("/", getHomePage);

export default router;

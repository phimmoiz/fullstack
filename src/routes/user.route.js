import express from "express";
import { getUser, getActivate, postActivate } from "../components/auth/userController";

const router = express.Router();

router.get("/", getUser);

router.get("/activate", getActivate);

router.post("/activate/:id", postActivate);
export default router;

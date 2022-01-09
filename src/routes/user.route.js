import express from "express";
import { getUser, getActivate } from "../components/auth/userController";

const router = express.Router();

router.get("/", getUser);

router.get("/activate", getActivate);

export default router;

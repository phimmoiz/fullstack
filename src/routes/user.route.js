import express from "express";
import { getUser } from "../components/auth/user.controller";

const router = express.Router();

router.get("/", getUser);

export default router;

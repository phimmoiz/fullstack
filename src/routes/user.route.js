import express from "express";
import { getUser, createUser } from "../components/auth/user.controller";

const router = express.Router();

router.get("/", getUser);
router.post("/", createUser);

export default router;

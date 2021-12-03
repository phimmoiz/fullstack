import express from "express";
import { getUser, createUser } from "../components/auth/userController";

const router = express.Router();

router.get("/", getUser);
router.post("/", createUser);

export default router;

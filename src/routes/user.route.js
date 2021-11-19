import express from "express";
import { getUser, createUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/", getUser);
router.post("/", createUser);

export default router;

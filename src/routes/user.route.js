import express from "express";
import { getUser, createUser } from "../components/auth/userController";

const router = express.Router();

router.get("/", getUser);

export default router;

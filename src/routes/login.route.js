import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../components/auth/userModel";
import createError from "http-errors";

import { postLogin, getLogin } from "../components/auth/loginController";

const router = Router();

router.get("/", getLogin);

router.post("/", postLogin);

export default router;

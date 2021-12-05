import { Router } from "express";

import { postLogin, getLogin } from "../components/auth/login.controller";

const router = Router();

router.get("/", getLogin);

router.post("/", postLogin);

export default router;

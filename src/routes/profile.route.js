import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import User from "../components/auth/userModel";
import createError from "http-errors";
import { hashPassword } from "../utils/";

import {
  getProfile,
  postChangePwd,
  getInfo,
  getChangePwd,
  getTermPolicy,
} from "../components/auth/profileController.js";

const router = Router();

router.use(requireAuth);
router.get("/", getProfile);

router.post("/changepwd", postChangePwd);

router.get("/info", getInfo);

router.get("/changepwd", getChangePwd);

router.get("/term_policy", getTermPolicy);

export default router;

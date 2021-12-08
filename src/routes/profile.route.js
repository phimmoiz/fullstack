import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";

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

import { Router } from "express";
import {
  getRegister,
  postRegister,
} from "../components/auth/register.controller";

const router = Router();

router.get("/", getRegister);
router.post("/", postRegister);
export default router;

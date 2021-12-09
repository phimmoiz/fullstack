import { Router } from "express";
import {
  getRegister,
  postRegister,
} from "../components/auth/registerController";

const router = Router();

router.get("/", getRegister);
router.post("/", postRegister);
export default router;

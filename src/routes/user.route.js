import express from "express";
import { postChangePwd } from "../components/auth/profileController";
import { getUser, getActivate, postActivate, postResetPwd, getResetPwd, postUpdatePassword } from "../components/auth/userController";

const router = express.Router();

router.get("/", getUser);

router.get("/activate", getActivate);

router.post("/activate/:id", postActivate);

router.post("/reset-pwd/:id", postResetPwd);

router.get("/reset-pwd", getResetPwd);

router.post("/updatePassword", postUpdatePassword);
export default router;

import { Router } from "express";
import { getMessages } from "../components/messages/messages.controller";

const router = Router();

router.get("/", getMessages);

export default router;

import { Router } from "express";
import { getMessages } from "../components/messages/messagesController";

const router = Router();

router.get("/", getMessages);

export default router;

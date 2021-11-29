import { Router } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";

const router = Router();

router.get("/", async (req, res, next) => {
  let { limit = 10, post_id } = req.query;
  try {
    var messages = await Message.find({})
      .sort({ time: "desc" })
      .limit(limit)
      .populate([
        {
          path: "author",
          model: User,
          select: "username avatar admin",
        },
      ]);

    res.json({ success: true, messages });
  } catch (e) {
    res.json({ success: false, message: e });
  }
});

export default router;

import User from "../auth/userModel";
import Message from "./messageModel";

export const getMessages = async (req, res, next) => {
  const { skip = 0 } = req.query;

  try {
    var messages = await Message.find({})
      .sort({ time: "desc" })
      .skip(+skip)
      .limit(10)
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
};

import cookie from "cookie";
import jwt from "jsonwebtoken";
import Message from "./message.model";

const messageSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("chat message", async (content) => {
      try {
        const { token } = cookie.parse(socket.handshake.headers.cookie); // get cookies from the client

        if (!token) {
          return;
        }

        let user = await jwt.verify(token, process.env.JWT_SECRET);

        if (!user) return; // TODO: Tell user that he is not authorized

        //command check
        if (content.startsWith("/clear") && user.role === "admin") {
          await Message.deleteMany({});

          content = `Admin cleared all messages (/clear)`;
          io.emit("delete all messages", newMessage);
        }

        const newMessage = await (
          await Message.create({
            author: user.id,
            content,
          })
        ).populate({
          path: "author",
          select: "username avatar role",
        });

        io.emit("chat message receive", newMessage);
      } catch (err) {
        console.log("[socket]", err);
      }
    });
  });
};

export default messageSocket;

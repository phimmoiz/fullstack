import cookie from "cookie";
import { getUserByToken } from "../auth/authService";
import Message from "./messageModel";

const messageSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("chat message", async (content) => {
      try {
        const { token } = cookie.parse(socket.handshake.headers.cookie); // get cookies from the client

        if (!token) {
          throw new Error("No token");
        }

        let user = await getUserByToken(token); // check if the token is valid

        if (!user) {
          throw new Error("No user");
        }

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

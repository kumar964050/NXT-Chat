import "dotenv/config"; // Load env variables

import { Server, Socket } from "socket.io";
import connectDB from "./config/database";
import User from "./models/user.model";
import Message from "./models/message.model";
import { ActiveUser, SocketMessage } from "./types";

import app from "./app";

const PORT: number = Number(process.env.PORT) || 3000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at PORT : http://localhost:${PORT}`);
});

connectDB().catch((error) => {
  console.error(`DB Error :${error.message}`);
  console.error(error);
  process.exit(1);
});

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// storing active users ids with socket id
const activeUsers: ActiveUser[] = [];

//01) add users to activeUsers & mark msg status as delivered(user got msgs) when user logged in
const addUser = async (userId: string, socketId: string) => {
  if (!activeUsers.some((user) => user.userId === userId)) {
    activeUsers.push({ userId: userId, socketId: socketId });
  }

  // mark sent msg status as delivered coz user logged in
  await Message.updateMany(
    { to: userId, status: { $eq: "sent" } },
    { status: "delivered" }
  );
};

//02) remove user from activeUser arr & update user last seen in db
const removeUser = (socketId: string) => {
  const index = activeUsers.findIndex((user) => user.socketId === socketId);
  if (index === -1) return;
  const user = activeUsers[index];
  activeUsers.splice(index, 1);
  // update last seen in user db
  (async () => {
    await User.findByIdAndUpdate(user.userId, { last_seen: new Date() });
  })();
};

//03) get user id by socket id
const getUser = (socketId: string) => {
  const user: ActiveUser | undefined = activeUsers.find(
    (user) => user.socketId === socketId
  );
  return user ? user.userId : null;
};

//04)  get socket id by user id
const getSocketId = (userId: string) => {
  const user = activeUsers.find((user) => user.userId === userId);
  return user ? user.socketId : null;
};

io.on("connection", (socket: Socket) => {
  // add user into active users list and send back active user list as arr
  socket.on("add-user", async (userId: string) => {
    try {
      await addUser(userId, socket.id);
      const userIds: string[] = activeUsers.map((u) => u.userId);
      io.emit("get-users", userIds);
    } catch (err) {
      console.error("add-user failed:", err);
    }
  });

  // send msg to (to user)
  socket.on("send-msg", (msg: SocketMessage) => {
    const toSocket = getSocketId(msg.to);
    if (toSocket) {
      socket.to(toSocket).emit("get-msg", msg);
    }
  });

  // mark msg status as a read when user open chat
  // TODO : inform opposite user about msgs marked as delivered
  socket.on(
    "mark-as-read-msgs",
    async ({ from, to }: { from: string; to: string }) => {
      await Message.updateMany(
        { from, to, status: { $ne: "read" } },
        { $set: { status: "read" } }
      );
    }
  );

  // offer Call
  socket.on("call-user", (data) => {
    const fromSocket = getSocketId(data.callerId);
    const toSocket = getSocketId(data.receiverId);
    if (toSocket) {
      io.to(toSocket).emit("incoming-call", data);
    } else {
      setTimeout(() => {
        if (fromSocket) io.to(fromSocket).emit("end-call");
      }, 8000);
    }
  });

  // Answer call
  socket.on("answer-call", (data) => {
    const toSocket = getSocketId(data.callerId);
    if (toSocket) io.to(toSocket).emit("call-answered", data);
  });

  //  ICE candidates
  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocket = getSocketId(to);
    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { candidate });
    }
  });

  // End call
  socket.on("end-call", (data) => {
    const fromSocket = getSocketId(data.callerId);
    const toSocket = getSocketId(data.receiverId);
    if (fromSocket) io.to(fromSocket).emit("end-call");
    if (toSocket) io.to(toSocket).emit("end-call");
  });

  // disconnected user or user went to offline
  socket.on("disconnect", () => {
    const userId: string | null = getUser(socket.id);
    removeUser(socket.id);
    io.emit("user-offline", userId);
    const usersIds: string[] = activeUsers.map((user) => user.userId);
    io.emit("get-users", usersIds);
  });
});

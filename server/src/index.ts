import "dotenv/config"; // Load environment variables
import { Server, Socket } from "socket.io";
import connectDB from "./config/database";
import User from "./models/user.model";
import Message from "./models/message.model";
import app from "./app";

const PORT: number = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at PORT : ${PORT}`);
});

connectDB().catch((error) => {
  console.error(`DB Error :${error.message}`);
  console.error(error);
  process.exit(1);
});

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

interface ActiveUser {
  userId: string;
  socketId: string;
}
interface SocketMessage {
  id: string;
  type: "text" | "image" | "video" | "audio" | "document" | "location";
  from: string;
  to: string;
  content: string;
  attachment?: {
    id: string;
    url: string;
    name: string;
    size: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: "sending" | "sent" | "delivered" | "read";
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}
interface CallProps {
  callerId: string;
  receiverId: string;
  type: "audio" | "video";
  offer: RTCSessionDescriptionInit;
}

// storing active users ids with socket id
// need to improve: socketIds:[] to store multiple sockets id for multiple logins
const activeUsers: ActiveUser[] = [];

// add users to activeUsers & mark msg status as delivered(user got msgs) when user logged in
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

// get user id by socket id
const getUser = (socketId: string) => {
  const user: ActiveUser | undefined = activeUsers.find(
    (user) => user.socketId === socketId
  );
  return user ? user.userId : null;
};
//  get socket id by user id
const getSocketId = (userId: string) => {
  const user = activeUsers.find((user) => user.userId === userId);
  return user ? user.socketId : null;
};

// remove user from activeUser arr & update user last seen in db
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

io.on("connection", (socket: Socket) => {
  //01) add user into active user arr list
  socket.on("add-user", async (userId: string) => {
    try {
      await addUser(userId, socket.id);
      const userIds: string[] = activeUsers.map((u) => u.userId);
      io.emit("get-users", userIds);
    } catch (err) {
      console.error("add-user failed:", err);
    }
  });
  // send msg to to user
  socket.on("send-msg", (msg: SocketMessage) => {
    const toSocket = getSocketId(msg.to);
    if (toSocket) {
      socket.to(toSocket).emit("get-msg", msg);
    }
  });

  // mark msg status as a read when user open chat
  socket.on(
    "mark-as-read-msgs",
    async ({ from, to }: { from: string; to: string }) => {
      await Message.updateMany(
        { from, to, status: { $ne: "read" } },
        { $set: { status: "read" } }
      );
    }
  );

  //
  socket.on("call-user", (data) => {
    // const fromSocket = getSocketId(data.callerId);
    const toSocket = getSocketId(data.receiverId);
    if (toSocket) io.to(toSocket).emit("incoming-call", data);
    // else {
    //   setTimeout(() => {
    //     if (fromSocket) io.to(fromSocket).emit("end-call");
    //   }, 8000);
    // }
  });

  // Answer call
  socket.on("answer-call", (data) => {
    const toSocket = getSocketId(data.callerId);
    if (toSocket) io.to(toSocket).emit("call-answered", data);
  });

  // Relay ICE candidates
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

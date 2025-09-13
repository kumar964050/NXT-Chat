import "dotenv/config"; // Load environment variables
import { Server, Socket } from "socket.io";
import connectDB from "./config/database";
import User from "./models/user.model";
import app from "./app";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
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

const activeUsers: ActiveUser[] = [];

// add users to activeUsers
const addUser = async (userId: string, socketId: string) => {
  if (!activeUsers.some((user) => user.userId === userId)) {
    activeUsers.push({ userId: userId, socketId: socketId });
  }
};

// get user id by socket id
const getUser = (socketId: string) => {
  const user = activeUsers.find((user) => user.socketId === socketId);
  return user ? user.userId : null;
};

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
  socket.on("add-user", (userId) => {
    addUser(userId, socket.id);
    const usersIds = activeUsers.map((user) => user.userId);
    io.emit("get-users", usersIds);
  });

  // send msg to to user
  socket.on("send-msg", (msg) => {
    const toSocket = getSocketId(msg.to);
    if (toSocket) {
      socket.to(toSocket).emit("get-msg", msg);
    }
  });

  //02 remove user from active user arr list
  socket.on("disconnect", () => {
    const userId = getUser(socket.id);
    removeUser(socket.id);
    io.emit("user-offline", userId);
    const usersIds = activeUsers.map((user) => user.userId);
    io.emit("get-users", usersIds);
  });
});

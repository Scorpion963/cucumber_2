import express from "express";
import { db } from "db";
import { createServer } from "http";
import { Server } from "socket.io";
import { redis } from "./services/redis/redis";

const app = express();
const port = 3001;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "http://localhost:3000",
  },
});

// io.use(async (socket, next) => {
//   const token = socket.handshake.auth.token;
//   const exists = await redis.get(token);
//   if (exists === 0) {
//     next(new Error("Invalid session"));
//   } else {
//     next();
//   }
// });

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);
});

server.listen(port, async () => {
  console.log("The server is running")
});

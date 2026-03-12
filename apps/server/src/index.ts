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

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));

  const exists = await redis.get(token);
  console.log("exists: ", exists);
  if (exists === 0) {
    return next(new Error("Invalid session"));
  }

  next();
});

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);
});

server.listen(port, async () => {
  console.log("The server is running");
});

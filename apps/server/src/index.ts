import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { redis } from "./services/redis/redis";
import z from "zod";
import sendTextMessageHandler from "./handlers/send-text-message";
import { createChatroomHandler } from "./handlers/create-new-chatroom-with-message";
import { chatMember, chats, db } from "db";
import { and, eq, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import deleteChatroomHandler from "./handlers/delete-chatroom";
import { ClientToServerEvents } from "types";

const app = express();
const port = 3001;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "http://localhost:3000",
  },
});

let userId: string;

let results;

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));

  const exists = await redis.get(token);
  if (exists === 0) {
    return next(new Error("Invalid session"));
  }

  const { success, data } = z
    .object({ user: z.object({ id: z.string() }) })
    .safeParse(exists);

  if (!success) {
    return next(new Error("Invalid data received from redis"));
  }

  userId = data.user.id;
  socket.join(userId);
  socket.data.userId = userId;

  results = await getChatroomsAndMembersIds(userId);

  results.forEach((chatroom) => {
    console.log("joined room: ", chatroom.chatId);
    socket.join(`room:${chatroom.chatId}`);
  });

  console.log("Results: ", results);

  next();
});

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  // socket.on("join_chatroom", (chatroomId: string) => {
  //   const chatroomIdExists = getChatroom(userId, chatroomId);

  //   if (!chatroomIdExists)
  //     socket.emit("error", {
  //       event: "join_chatroom",
  //       error: {
  //         message:
  //           "You are not a member of this chatroom or the chatroom doesn't exist",
  //         code: "",
  //       },
  //     });
  // });

  socket.on(ClientToServerEvents.SEND_TEXT_MESSAGE, (data) =>
    sendTextMessageHandler(socket, io, data),
  );
  socket.on(ClientToServerEvents.CREATE_CHATROOM, (data) =>
    createChatroomHandler(socket, io, data),
  );
  socket.on(ClientToServerEvents.DELETE_CHATROOM, (data) =>
    deleteChatroomHandler(socket, io, data),
  );
});

server.listen(port, async () => {
  console.log("The server is running");
});

async function getMemberIds(chatroomId: string) {
  return db
    .select({ chatMemberId: chatMember.userId })
    .from(chats)
    .innerJoin(chatMember, eq(chatMember.chatId, chats.id))
    .where(eq(chats.id, chatroomId));
}

async function getChatroom(userId: string, chatroomId: string) {
  return db
    .select({ chatroomId: chats.id })
    .from(chatMember)
    .leftJoin(chats, eq(chats.id, chatMember.chatId))
    .where(and(eq(chatMember.userId, userId), eq(chats.id, chatroomId)));
}

async function getChatroomsAndMembersIds(userId: string) {
  const otherMembers = alias(chatMember, "other_members");

  return db
    .select({
      chatId: chats.id,
      chatterIds: sql<string[]>`array_agg(${otherMembers.userId})`,
    })
    .from(chatMember)
    .innerJoin(chats, eq(chats.id, chatMember.chatId))
    .leftJoin(
      otherMembers,
      and(eq(otherMembers.chatId, chats.id), ne(otherMembers.userId, userId)),
    )
    .where(and(eq(chatMember.userId, userId)))
    .groupBy(chats.id, otherMembers.userId);
}

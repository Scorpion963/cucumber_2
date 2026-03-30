import type { Server, Socket } from "socket.io";
import z from "zod";
import emitError from "../utils/sockets/emitErrot";
import { alias } from "drizzle-orm/pg-core";
import { chatMember, chats, contact, db, message, user } from "../db";
import { and, eq, inArray, sql } from "drizzle-orm";
import {
  createAndUpdateLatestMessage,
  messageItemSchema,
} from "./send-text-message";
import { SOCKET_EMITS } from "../event-listener-names";

const requestSchema = messageItemSchema.extend({
  senderId: z.string().trim().min(1),
  receiverId: z.string().trim().min(1),
});

type CreatorReturnPayload = {
  tempId: string;
  chat: typeof chats.$inferSelect;
  message: typeof message.$inferSelect;
  isCreator: true;
  userId: string
};

type CreatorType = typeof user.$inferSelect & {
  contactInfo: typeof contact.$inferSelect | null;
};

type ReceiverReturnPayload = {
  chat: typeof chats.$inferSelect;
  message: typeof message.$inferSelect;
  isCreator: false;
  creator: CreatorType;
};

export async function createChatroomHandler(
  socket: Socket,
  io: Server,
  requestData: unknown,
) {
  const { data, success, error } = requestSchema.safeParse(requestData);

  if (!success) {
    console.log("invalid data");
    console.log("error: ", error);
    emitError(socket, "idk", { code: "", message: "" });
    return;
  }

  let chat = await findOrCreatePrivateChat(data.receiverId, data.senderId);

  if (!chat) {
    console.log("Error inside createChatHandler: unable to create chat");
    // emitError()
    return;
  }

  const newMessage = await createAndUpdateLatestMessage({
    ...data,
    chatId: chat.id,
  });
  if (!newMessage) {
    console.log("Error message wasn't created in createChatroomHandler");
    return;
  }

  // joining all the active users to the room
  console.log("success");
  const [creator] = await db
    .select({ user, contactInfo: contact })
    .from(user)
    .leftJoin(contact, eq(contact.ownerId, data.receiverId))
    .where(eq(user.id, data.senderId))
    .limit(1);

  console.log("creator: ", creator);

  const memberSockets = await io.in(data.receiverId).fetchSockets();
  memberSockets.forEach((singleSocket) => {
    singleSocket.join(`room:${chat.id}`);
    if (creator?.user) {
      const receiverPayload: ReceiverReturnPayload = {
        chat: chat,
        message: newMessage,
        isCreator: false,
        creator: { ...creator.user, contactInfo: creator.contactInfo ?? null },
      };

      singleSocket.emit(SOCKET_EMITS.NEW_CHAT_ROOM_CREATED, {
        ...receiverPayload,
      });
    }
  });

  socket.join(`room:${chat.id}`);
  const creatorPayload: CreatorReturnPayload = {
    userId: data.receiverId,
    chat: chat,
    isCreator: true,
    message: newMessage,
    tempId: data.chatId,
  };

  socket.emit(SOCKET_EMITS.NEW_CHAT_ROOM_CREATED, {
    ...creatorPayload,
  });
}

async function findOrCreatePrivateChat(
  firstMemberId: string,
  secondMemberId: string,
) {
  let [chat] = await db
    .select({ chat: chats })
    .from(chatMember)
    .innerJoin(chats, eq(chats.id, chatMember.chatId))
    .where(
      and(
        inArray(chatMember.userId, [firstMemberId, secondMemberId]),
        eq(chats.type, "private"),
      ),
    )
    .groupBy(chats.id)
    .having(sql`COUNT(DISTINCT ${chatMember.userId}) = 2`);

  if (!chat) {
    const res = await createPrivateChatWithMembers(
      firstMemberId,
      secondMemberId,
    );
    return res?.chat ?? null;
  }

  return chat.chat;
}

function createPrivateChatWithMembers(firstId: string, secondId: string) {
  return db.transaction(async (ctx) => {
    try {
      const [newChat] = await db
        .insert(chats)
        .values({ type: "private" })
        .returning();
      if (!newChat) {
        return null;
      }
      const members = await db
        .insert(chatMember)
        .values([
          { chatId: newChat.id, userId: firstId },
          { chatId: newChat.id, userId: secondId },
        ])
        .returning();

      return { chat: newChat, members: members };
    } catch {
      console.log("Server error happened");
      return null;
    }
  });
}

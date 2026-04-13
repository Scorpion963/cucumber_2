import type { Server, Socket } from "socket.io";
import z from "zod";
import emitError, { ErrorPayload } from "../utils/sockets/emitErrot";
import { chatMember, chats, contact, db, message, user } from "db";
import { eq } from "drizzle-orm";
import {
  createAndUpdateLatestMessage,
  messageItemSchema,
} from "./send-text-message";
import { ServerToClientEvents } from "types";
// import { SOCKET_EMITS, SOCKET_ERRORS } from "../event-listener-names";

// TODO: Fixe race condition
// TODO: Check the senderId

const requestSchema = messageItemSchema.extend({
  senderId: z.string().trim().min(1),
  receiverId: z.string().trim().min(1),
});

const requestErrorSchema = requestSchema.pick({
  receiverId: true,
  id: true,
  chatId: true,
});

type CreatorReturnPayload = {
  tempId: string;
  chat: typeof chats.$inferSelect;
  message: typeof message.$inferSelect;
  isCreator: true;
  receiverId: string;
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

type ErrorDataType = {
  tempId: string;
  receiverId: string;
};

type ChatCreationErroPayload = ErrorPayload<ErrorDataType>;

export async function createChatroomHandler(
  socket: Socket,
  io: Server,
  requestData: unknown,
) {
  const { data, success, error } = requestSchema.safeParse(requestData);
  
  if (!success) {
    const {
      success: errorSucces,
      data: errorData,
      error: errorError,
    } = requestErrorSchema.safeParse(requestData);

    console.error("invalid data");
    console.error("error: ", error);

    emitError(socket, "CHAT_CREATION_FAILED", {
      code: "CHAT_INVALID_DATA",
      message: "Error: Invalid request data",
      data: errorSucces ? errorData : null,
    });
    return;
  }

  try {
    const receiver = await db.query.user.findFirst({
      where: eq(user.id, data.receiverId),
      columns: { id: true },
    });

    if (!receiver) {
      console.log("Invalid receiver");
      const payload: ChatCreationErroPayload = {
        code: "INVALID_RECEIVER",
        message: "The chatter you're trying interact with doesn't exist",
        data: {
          receiverId: data.receiverId,
          tempId: data.chatId,
        },
      };

      emitError(socket, "CHAT_CREATION_FAILED", payload);
      return;
    }

    let chat = await findOrCreatePrivateChat(data.receiverId, data.senderId);

    const newMessage = await createAndUpdateLatestMessage({
      ...data,
      chatId: chat.id,
    });

    if (!newMessage) {
      console.error("Error message wasn't created in createChatroomHandler");
      throw new Error("Message creation failed");
    }

    // joining all the active users to the room
    const [creator] = await db
      .select({ user, contactInfo: contact })
      .from(user)
      .leftJoin(contact, eq(contact.ownerId, data.receiverId))
      .where(eq(user.id, data.senderId))
      .limit(1);

    const memberSockets = await io.in(data.receiverId).fetchSockets();
    memberSockets.forEach((singleSocket) => {
      singleSocket.join(`room:${chat.id}`);
      if (creator?.user) {
        const receiverPayload: ReceiverReturnPayload = {
          chat: chat,
          message: newMessage,
          isCreator: false,
          creator: {
            ...creator.user,
            contactInfo: creator.contactInfo ?? null,
          },
        };

        singleSocket.emit(ServerToClientEvents.NEW_CHAT_ROOM_CREATED, {
          ...receiverPayload,
        });
      } 
    });

    socket.join(`room:${chat.id}`);
    const creatorPayload: CreatorReturnPayload = {
      receiverId: data.receiverId,
      chat: chat,
      isCreator: true,
      message: newMessage,
      tempId: data.chatId,
    };

    socket.emit(ServerToClientEvents.NEW_CHAT_ROOM_CREATED, {
      ...creatorPayload,
    });

    console.log("success");
  } catch (err) {
    console.error(
      "Error inside createChatHandler: unable to create chat: ",
      err,
    );
    const payload: ChatCreationErroPayload = {
      data: { receiverId: data.receiverId, tempId: data.chatId },
      code: "CHAT_CREATION_FAILED",
      message: "Error: Could not create chat",
    };
    emitError(socket, "CHAT_CREATION_FAILED", payload);
    return;
  }
}

function createPrivateKey(first: string, second: string) {
  return [first, second].sort().join("_");
}

async function findOrCreatePrivateChat(
  firstMemberId: string,
  secondMemberId: string,
) {
  const privateKey = createPrivateKey(firstMemberId, secondMemberId);
  let [chat] = await db
    .select({ chat: chats })
    .from(chats)
    .where(eq(chats.privateKey, privateKey));

  if (!chat) {
    const res = await createPrivateChatWithMembers(
      firstMemberId,
      secondMemberId,
    );

    return res.chat;
  }

  return chat.chat;
}

function createPrivateChatWithMembers(firstId: string, secondId: string) {
  return db.transaction(async (ctx) => {
    const privateKey = createPrivateKey(firstId, secondId);

    const [newChat] = await ctx
      .insert(chats)
      .values({ type: "private", privateKey: privateKey })
      .onConflictDoNothing()
      .returning();

    if (!newChat) throw new Error("Error: Chat could not be inserted");

    const members = await ctx
      .insert(chatMember)
      .values([
        { chatId: newChat.id, userId: firstId },
        { chatId: newChat.id, userId: secondId },
      ])
      .returning();

    return { chat: newChat, members: members };
  });
}

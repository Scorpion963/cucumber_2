import type { Server, Socket } from "socket.io";
import emitError from "../utils/sockets/emitErrot";
import { chatMember, chats, db, message } from "db";
import z, { string } from "zod";
import { SOCKET_EMITS, SOCKET_ERRORS, SOCKET_EVENTS } from "../event-listener-names";
import { and, eq, or } from "drizzle-orm";

type MessageItemType = Required<
  Pick<typeof message.$inferInsert, "senderId" | "chatId" | "text">
> &
  Pick<
    typeof message.$inferInsert,
    "forwardedFromMessageId" | "replyToMessageId"
  >;
export const messageItemSchema = z.object({
  senderId: z.string(),
  chatId: z.string(),
  text: z.string(),
  forwardedFromMessageId: z.string().nullish(),
  replyToMessageId: z.string().nullish(),
  id: z.string().optional(),
});

// TODO: send better errors

export default async function sendTextMessageHandler(
  socket: Socket,
  io: Server,
  requestData: unknown,
) {
  const { success, data } = messageItemSchema.safeParse(requestData);

  if (!success) {
    console.log("Error validating");
    emitError(socket, SOCKET_ERRORS.MESSAGE_CREATION_ERROR, {
      code: "INVALID_DATA",
      message: "Invalid text message",
    });
    return;
  }

  try {
    const newMessage = await createAndUpdateLatestMessage({
      ...data,
      chatId: data.chatId,
    });

    if (!newMessage) throw new Error("Could not insert message")

    socket.emit(SOCKET_EMITS.ACK_MESSAGE_CREATED, newMessage.id);

    io.to(`room:${newMessage.chatId}`).emit(
      SOCKET_EMITS.MESSAGE_CREATED,
      newMessage,
    );
  } catch {
    emitError(socket, "send_text_message", {
      code: "",
      message: "Internal Server Error: failed db insert",
    });

    socket.emit(SOCKET_EVENTS.SEND_TEXT_MESSAGE, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}


export function createAndUpdateLatestMessage(data: typeof message.$inferInsert) {
  return db.transaction(async (ctx) => {
    const [newMessage] = await ctx
      .insert(message)
      .values({ ...data })
      .returning();

    if (!newMessage) return null;

    await ctx
      .update(chats)
      .set({ lastMessageId: newMessage.id })
      .where(eq(chats.id, newMessage.chatId));

    return newMessage;
  });
}

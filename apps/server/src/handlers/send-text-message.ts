import type { Server, Socket } from "socket.io";
import emitError from "../utils/sockets/emitErrot";
import { chats, db, message } from "../db";
import z from "zod";
import { SOCKET_EMITS, SOCKET_EVENTS } from "../event-listener-names";
import { eq } from "drizzle-orm";

type MessageItemType = Required<
  Pick<typeof message.$inferInsert, "senderId" | "chatId" | "text">
> &
  Pick<
    typeof message.$inferInsert,
    "forwardedFromMessageId" | "replyToMessageId"
  >;
const messageItemSchema = z.object({
  senderId: z.string(),
  chatId: z.string(),
  text: z.string(),
  forwardedFromMessageId: z.string().nullish(),
  replyToMessageId: z.string().nullish(),
  id: z.string().optional(),
});

export default async function sendTextMessageHandler(
  socket: Socket,
  io: Server,
  requestData: unknown,
) {
  const { success, data } = messageItemSchema.safeParse(requestData);

  if (!success) {
    console.log("Error validating");
    emitError(socket, "send_text_message", {
      code: "",
      message: "Invalid text message",
    });
    return;
  }

  try {
    const newMessage = await createAndUpdateLatestMessage(data);

    if (!newMessage) {
      emitError(socket, SOCKET_EVENTS.SEND_TEXT_MESSAGE, {
        code: "",
        message: "Internal Server Error: failed db insert",
      });
      return;
    }

    console.log("Success")

    io.to(`room:${newMessage.chatId}`).emit(
      SOCKET_EMITS.MESSAGE_CREATED,
      newMessage,
    );
  } catch {
    emitError(socket, "send_text_message", {
      code: "",
      message: "Internal Server Error: failed db insert",
    });
  }
}

function createAndUpdateLatestMessage(data: z.infer<typeof messageItemSchema>) {
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

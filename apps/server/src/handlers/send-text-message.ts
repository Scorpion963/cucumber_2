import type { Server, Socket } from "socket.io";
import emitError from "../utils/sockets/emitErrot";
import { db, message } from "../db";
import z from "zod";
import { SOCKET_EMITS, SOCKET_EVENTS } from "../event-listener-names";

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
  id: z.string().optional()
});

export default async function sendTextMessageHandler(
  socket: Socket,
  io: Server,
  requestData: unknown,
) {
  const { success, data } = messageItemSchema.safeParse(requestData);


  if (!success) {
    console.log("Error validating")
    emitError(socket, "send_text_message", {
      code: "",
      message: "Invalid text message",
    });
    return;
  }

  try {
    const [newMessage] = await db
      .insert(message)
      .values({ ...data })
      .returning();

    if (!newMessage) {
      emitError(socket, SOCKET_EVENTS.SEND_TEXT_MESSAGE, {
        code: "",
        message: "Internal Server Error: failed db insert",
      });
      return;
    }

    io.to(`room:${newMessage.chatId}`).emit(SOCKET_EMITS.MESSAGE_CREATED, newMessage);
  } catch {
    emitError(socket, "send_text_message", {
      code: "",
      message: "Internal Server Error: failed db insert",
    });
  }
}

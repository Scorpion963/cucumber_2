import type { Server, Socket } from "socket.io";
import emitError from "../utils/sockets/emitErrot";
import { chatMember, chats, db, message } from "db";
import z, { string } from "zod";
import { ServerToClientErrors, ServerToClientEvents } from "types";
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
    // TODO: Validate that message Id exists and send it back, so that the client can delete the message in local db
    console.log("Error validating");
    const { success: errorSuccess, data: errorData } = messageItemSchema
      .pick({
        id: true,
      })
      .safeParse(requestData);

    emitError(socket, ServerToClientErrors.MESSAGE_CREATION_ERROR, {
      code: "",
      data: errorSuccess ? errorData : null,
      message: "Error: Invalid Data",
    });
    return;
  }

  try {
    const newMessage = await createAndUpdateLatestMessage({
      ...data,
      chatId: data.chatId,
    });

    if (!newMessage) throw new Error("Could not insert message");

    socket.emit(ServerToClientEvents.ACK_MESSAGE_CREATED, newMessage.id);

    io.to(`room:${newMessage.chatId}`).emit(
      ServerToClientEvents.MESSAGE_CREATED,
      newMessage,
    );
  } catch {
    emitError(socket, "MESSAGE_CREATION_ERROR", {
      code: "",
      data: { id: data.id },
      message: "Internal Server Error",
    });

    // TODO: Send the object as an error

    // socket.emit(SOCKET_EVENTS.SEND_TEXT_MESSAGE, {
    //   ...data,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });
  }
}

export function createAndUpdateLatestMessage(
  data: typeof message.$inferInsert,
) {
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

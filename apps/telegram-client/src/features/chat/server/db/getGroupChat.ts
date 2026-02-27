import { chatMember, chats, db, message } from "db";
import { and, eq } from "drizzle-orm";

export default async function getGroupChat(chatId: string, userId: string) {
  const [chat] = await db
    .select({ chats, message })
    .from(chatMember)
    .innerJoin(chats, eq(chats.id, chatMember.chatId))
    .leftJoin(message, eq(chats.lastMessageId, message.id))
    .where(
      and(
        eq(chatMember.userId, userId),
        eq(chats.id, chatId),
        eq(chats.type, "group")
      )
    );

  return chat;
}

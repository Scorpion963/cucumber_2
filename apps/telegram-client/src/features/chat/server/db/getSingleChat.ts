import { chatMember, chats, contact, db, message, user } from "db";
import { and, eq, inArray, sql } from "drizzle-orm";

export default async function getSingleChat(chatterId: string, userId: string) {
  const [chat] = await db
    .select({ chat: chats, message: message })
    .from(chatMember)
    .innerJoin(chats, eq(chats.id, chatMember.chatId))
    .leftJoin(message, eq(message.id, chats.lastMessageId))
    .where(
      and(
        inArray(chatMember.userId, [chatterId, userId]),
        eq(chats.type, "private")
      )
    )
    .groupBy(chats.id, message.id)
    .having(sql`COUNT(DISTINCT ${chatMember.userId}) = 2`);

  if (!chat) return null;

  return chat;
}

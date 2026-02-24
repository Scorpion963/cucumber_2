import { chatMember, chats, contact, db, user } from "db";
import { and, eq, inArray, sql } from "drizzle-orm";

export default async function getSingleChat(chatterId: string, userId: string) {
  const [chat] = await db
    .select({ chat: chats })
    .from(chatMember)
    .innerJoin(chats, eq(chats.id, chatMember.chatId))
    .where(
      and(
        inArray(chatMember.userId, [chatterId, userId]),
        eq(chats.type, "private")
      )
    )
    .groupBy(chats.id)
    .having(sql`COUNT(DISTINCT ${chatMember.userId}) = 2`);

  if (!chat) return null;

  return chat;
}

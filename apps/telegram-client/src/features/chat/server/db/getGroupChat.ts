import { chatMember, chats, db } from "db";
import { and, eq } from "drizzle-orm";

export default async function getGroupChat(chatId: string, userId: string) {
  const [chat] = await db
    .select({ chats })
    .from(chatMember)
    .innerJoin(chats, eq(chats.id, chatMember.chatId))
    .where(
      and(
        eq(chatMember.userId, userId),
        eq(chats.id, chatId),
        eq(chats.type, "group")
      )
    );

  return chat.chats;
}

import { chatMember, chats, contact, db, user } from "db";
import { and, eq, inArray, sql } from "drizzle-orm";

export default async function getSingleChat(chatterId: string, userId: string) {
  const isContact = await db.query.contact.findFirst({
    where: and(eq(contact.ownerId, userId), eq(contact.contactId, chatterId)),
  });

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

  const chatToReturn: typeof chats.$inferSelect = {
    ...chat.chat,
    imageUrl: isContact ? isContact.imageUrl : chat.chat.imageUrl,
    name: isContact ? isContact.name : chat.chat.name,
  };

  return chatToReturn;
}

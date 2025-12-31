import { chatMember, chats, contact, db, message, user } from "db";
import { and, eq, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export default function findHomeChatsForStore(currentUserId: string) {
  const chatMemberAlias = alias(chatMember, "other_members");

  return db
    .select({
      id: chats.id,
      type: chats.type,
      name: chats.name,
      imageUrl: chats.imageUrl,
      baseChatter: {
        id: user.id,
        name: user.name,
        username: user.username,
        imageUrl: user.image,
        bio: user.bio,
        lastNmae: user.lastName,
      },
      contactInfo: {
        contactId: contact.id,
        imageUrl: contact.imageUrl,
        name: contact.name,
        lastName: contact.lastName,
        notes: contact.notes,
      },
      lastMessage: {
        text: message.text,
        updatedAt: message.updatedAt,
      },
    })
    .from(chatMember)
    .innerJoin(chats, eq(chats.id, chatMember.chatId))
    .leftJoin(message, eq(message.id, chats.lastMessageId))
    .leftJoin(
      chatMemberAlias,
      and(
        eq(chatMemberAlias.chatId, chats.id),
        ne(chatMemberAlias.userId, currentUserId),
        eq(chats.type, "private")
      )
    )
    .leftJoin(user, eq(user.id, chatMemberAlias.userId))
    .leftJoin(
      contact,
      and(
        eq(contact.ownerId, currentUserId),
        eq(contact.contactId, chatMemberAlias.id)
      )
    )
    .where(eq(chatMember.userId, currentUserId))
    .orderBy(chats.updatedAt);
}

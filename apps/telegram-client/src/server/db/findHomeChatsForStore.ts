import { ConctactInfo } from "@/providers/types/user-store-provider-types";
import { chatMember, chats, contact, db, message, user } from "db";
import { and, desc, eq, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export type FindHomeChatsReturnType = {
  id: string;
  type: "private" | "group";
  name: string | null;
  imageUrl: string | null;
  baseChatter: typeof user.$inferSelect | null;
  contactInfo: typeof contact.$inferSelect | null;
  lastMessage: {
    id: string;
    text: string | null;
    updatedAt: Date;
  } | null;
};

export type BasicContact = {
  id: string;
  imageUrl: string | null;
  name: string | null;
  lastName: string | null;
  notes: string | null;
};

export default function findHomeChatsForStore(
  currentUserId: string,
): Promise<FindHomeChatsReturnType[]> {
  const chatMemberAlias = alias(chatMember, "other_members");

  return db
    .select({
      id: chats.id,
      type: chats.type,
      name: chats.name,
      imageUrl: chats.imageUrl,
      baseChatter: user,
      contactInfo: contact,
      lastMessage: {
        id: message.id,
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
        eq(chats.type, "private"),
      ),
    )
    .leftJoin(user, eq(user.id, chatMemberAlias.userId))
    .leftJoin(
      contact,
      and(
        eq(contact.ownerId, currentUserId),
        eq(contact.contactId, chatMemberAlias.userId),
      ),
    )
    .where(eq(chatMember.userId, currentUserId))
    .orderBy(desc(chats.updatedAt));
}

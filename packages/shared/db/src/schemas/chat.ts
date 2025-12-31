import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { chatMember } from "./chatMember";
import { createdAt, updatedAt } from "../schemaUtils";
import { message } from "./message/message";

export const CHAT_TYPES = ["private", "group"] as const;
export type ChatType = (typeof CHAT_TYPES)[number];
export const ChatTypeEnum = pgEnum("chat_type", CHAT_TYPES);

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  type: ChatTypeEnum().notNull(),
  name: varchar("name", { length: 100 }),
  imageUrl: text("image_url"),
  lastMessageId: uuid("message_id").references((): AnyPgColumn => message.id, {
    onDelete: "set null",
  }),
  createdAt,
  updatedAt,
});

export const chatRelations = relations(chats, ({ many, one }) => ({
  chatMember: many(chatMember),
  messages: many(message, { relationName: "messages" }),
  lastMessage: one(message, {
    fields: [chats.lastMessageId],
    references: [message.id],
    relationName: "last_message",
  }),
}));

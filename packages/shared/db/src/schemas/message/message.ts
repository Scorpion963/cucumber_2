import { AnyPgColumn, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { chats } from "../chat";
import { user } from "../auth-schema";
import { createdAt, updatedAt } from "../../schemaUtils";
import { relations } from "drizzle-orm";
import { reaction } from "./reaction";
import { messageMedia } from "./messageMedia";

export const message = pgTable("messages", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),
  senderId: uuid("sender_id").references(() => user.id, {
    onDelete: "set null",
  }),
  replyToMessageId: uuid("reply_to_message_id").references(
    (): AnyPgColumn => message.id,
    {
      onDelete: "set null",
    }
  ),
  forwardedFromMessageId: uuid("forwarded_from_message_id").references(
    (): AnyPgColumn => message.id,
    { onDelete: "set null" }
  ),

  text: text(),

  createdAt,
  updatedAt,
});

export const messageRelations = relations(message, ({ one, many }) => ({
  attachments: many(messageMedia),
  chat: one(chats, {
    fields: [message.chatId],
    references: [chats.id],
    relationName: "messages"
  }),
  sender: one(user, {
    fields: [message.senderId],
    references: [user.id],
  }),
  replies: many(message, {
    relationName: "message_replies",
  }),
  replyTo: one(message, {
    fields: [message.replyToMessageId],
    references: [message.id],
    relationName: "message_replies",
  }),
  forwardedFrom: one(message, {
    fields: [message.forwardedFromMessageId],
    references: [message.id],
    relationName: "message_forwards",
  }),
  forwards: many(message, {
    relationName: "message_forwards",
  }),
  reactions: many(reaction),
}));

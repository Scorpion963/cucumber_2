import {
  AnyPgColumn,
  integer,
  pgEnum,
  PgEnum,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaUtils";
import { relations } from "drizzle-orm";
import { chats } from "./chat";
import { user } from "./auth-schema";

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

export const reaction = pgTable(
  "reactions",
  {
    senderId: uuid("sender_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    messageId: uuid("message_id")
      .references(() => message.id, { onDelete: "cascade" })
      .notNull(),
    emoji: varchar("emoji", { length: 32 }).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.senderId, table.messageId] })]
);

export const reactionRelations = relations(reaction, ({ one }) => ({
  message: one(message, {
    fields: [reaction.messageId],
    references: [message.id],
  }),

  sender: one(user, {
    fields: [reaction.senderId],
    references: [user.id],
  }),
}));

export const MEDIA_TYPES = ["video", "audio", "image"] as const;
export type MediaTypes = (typeof MEDIA_TYPES)[number];
export const MediaTypesEnum = pgEnum("media_type", MEDIA_TYPES);

export const messageMedia = pgTable("message_media", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  messageId: uuid("message_id")
    .references(() => message.id, { onDelete: "cascade" })
    .notNull(),
  url: text().notNull(),
  mimeType: varchar("mime_type"),
  type: MediaTypesEnum().notNull(),
  sizeBytes: integer("size_bytes"),
  width: integer("width"),
  height: integer("height"),
  durationMs: integer("duration_ms"),
  createdAt,
  updatedAt,
});

export const messageMediaRelations = relations(messageMedia, ({ one }) => ({
  message: one(message, {
    fields: [messageMedia.messageId],
    references: [message.id],
  }),
}));

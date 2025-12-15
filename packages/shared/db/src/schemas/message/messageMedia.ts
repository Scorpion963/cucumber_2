import { integer, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { message } from "./message";
import { createdAt, updatedAt } from "../../schemaUtils";
import { relations } from "drizzle-orm";

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

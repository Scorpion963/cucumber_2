import { integer, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { message } from "./message";
import { createdAt, updatedAt } from "../../schemaUtils";
import { relations } from "drizzle-orm";
export var MEDIA_TYPES = ["video", "audio", "image"];
export var MediaTypesEnum = pgEnum("media_type", MEDIA_TYPES);
export var messageMedia = pgTable("message_media", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    messageId: uuid("message_id")
        .references(function () { return message.id; }, { onDelete: "cascade" })
        .notNull(),
    url: text().notNull(),
    mimeType: varchar("mime_type"),
    type: MediaTypesEnum().notNull(),
    sizeBytes: integer("size_bytes"),
    width: integer("width"),
    height: integer("height"),
    durationMs: integer("duration_ms"),
    createdAt: createdAt,
    updatedAt: updatedAt,
});
export var messageMediaRelations = relations(messageMedia, function (_a) {
    var one = _a.one;
    return ({
        message: one(message, {
            fields: [messageMedia.messageId],
            references: [message.id],
        }),
    });
});

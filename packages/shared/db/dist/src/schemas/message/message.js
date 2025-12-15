import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { chats } from "../chat";
import { user } from "../auth-schema";
import { createdAt, updatedAt } from "../../schemaUtils";
import { relations } from "drizzle-orm";
import { reaction } from "./reaction";
import { messageMedia } from "./messageMedia";
export var message = pgTable("messages", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    chatId: uuid("chat_id")
        .references(function () { return chats.id; }, { onDelete: "cascade" })
        .notNull(),
    senderId: uuid("sender_id").references(function () { return user.id; }, {
        onDelete: "set null",
    }),
    replyToMessageId: uuid("reply_to_message_id").references(function () { return message.id; }, {
        onDelete: "set null",
    }),
    forwardedFromMessageId: uuid("forwarded_from_message_id").references(function () { return message.id; }, { onDelete: "set null" }),
    text: text(),
    createdAt: createdAt,
    updatedAt: updatedAt,
});
export var messageRelations = relations(message, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
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
    });
});

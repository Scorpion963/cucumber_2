import { pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "../auth-schema";
import { createdAt, updatedAt } from "../../schemaUtils";
import { relations } from "drizzle-orm";
import { message } from "./message";
export var reaction = pgTable("reactions", {
    senderId: uuid("sender_id")
        .references(function () { return user.id; }, { onDelete: "cascade" })
        .notNull(),
    messageId: uuid("message_id")
        .references(function () { return message.id; }, { onDelete: "cascade" })
        .notNull(),
    emoji: varchar("emoji", { length: 32 }).notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt,
}, function (table) { return [primaryKey({ columns: [table.senderId, table.messageId] })]; });
export var reactionRelations = relations(reaction, function (_a) {
    var one = _a.one;
    return ({
        message: one(message, {
            fields: [reaction.messageId],
            references: [message.id],
        }),
        sender: one(user, {
            fields: [reaction.senderId],
            references: [user.id],
        }),
    });
});

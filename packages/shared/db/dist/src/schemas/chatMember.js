import { boolean, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { chats } from "./chat";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { createdAt, updatedAt } from "../schemaUtils";
export var chatMember = pgTable("chat_member", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    isAdmin: boolean("is_admin").notNull().default(false),
    userId: uuid("user_id")
        .notNull()
        .references(function () { return user.id; }, { onDelete: "cascade" }), // figure out the auth schema
    chatId: uuid("chat_id")
        .notNull()
        .references(function () { return chats.id; }, { onDelete: "cascade" }),
    createdAt: createdAt,
    updatedAt: updatedAt,
}, function (table) { return [unique("chat_member_unique").on(table.chatId, table.userId)]; });
export var chatMemberRelations = relations(chatMember, function (_a) {
    var one = _a.one;
    return ({
        user: one(user, {
            fields: [chatMember.userId],
            references: [user.id],
        }),
        chat: one(chats, {
            fields: [chatMember.chatId],
            references: [chats.id],
        }),
    });
});

import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, uuid, varchar, } from "drizzle-orm/pg-core";
import { chatMember } from "./chatMember";
import { createdAt, updatedAt } from "../schemaUtils";
export var CHAT_TYPES = ["private", "group"];
export var ChatTypeEnum = pgEnum("chat_type", CHAT_TYPES);
export var chats = pgTable("chats", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    type: ChatTypeEnum().notNull(),
    name: varchar("name", { length: 100 }),
    imageUrl: text("image_url"),
    createdAt: createdAt,
    updatedAt: updatedAt,
});
export var chatRelations = relations(chats, function (_a) {
    var many = _a.many;
    return ({
        chatMember: many(chatMember),
    });
});

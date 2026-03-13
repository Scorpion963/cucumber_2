import { boolean, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { chats } from "./chat";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";
import { createdAt, updatedAt } from "../schemaUtils";

export const chatMember = pgTable(
  "chat_member",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    isAdmin: boolean("is_admin").notNull().default(false),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // figure out the auth schema
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (table) => [unique("chat_member_unique").on(table.chatId, table.userId)]
);

export const chatMemberRelations = relations(chatMember, ({ one }) => ({
  user: one(user, {
    fields: [chatMember.userId],
    references: [user.id],
  }),

  chat: one(chats, {
    fields: [chatMember.chatId],
    references: [chats.id],
  }),
}));

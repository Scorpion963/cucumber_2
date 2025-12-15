import { pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "../auth-schema";
import { createdAt, updatedAt } from "../../schemaUtils";
import { relations } from "drizzle-orm";
import { message } from "./message";

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

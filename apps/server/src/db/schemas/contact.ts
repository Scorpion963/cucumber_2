import { relations } from "drizzle-orm";
import { pgTable, text, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { createdAt, updatedAt } from "../schemaUtils";

export const contact = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }),
    lastName: varchar("lastName", {length: 100}),
    imageUrl: text("image"),
    notes: varchar("notes", {length: 100}),
    createdAt,
    updatedAt,
  },
  (table) => [unique("contact_unique").on(table.ownerId, table.contactId)]
);

export const contactRelations = relations(contact, ({ one }) => ({
  owner: one(user, {
    fields: [contact.ownerId],
    references: [user.id],
    relationName: "owners"
  }),

  contact: one(user, {
    fields: [contact.contactId],
    references: [user.id],
    relationName: "contacts"
  }),
}));

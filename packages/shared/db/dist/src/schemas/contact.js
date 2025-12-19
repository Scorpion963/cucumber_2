import { relations } from "drizzle-orm";
import { pgTable, text, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { createdAt, updatedAt } from "../schemaUtils";
export var contact = pgTable("contacts", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    ownerId: uuid("owner_id")
        .notNull()
        .references(function () { return user.id; }, { onDelete: "cascade" }),
    contactId: uuid("contact_id")
        .notNull()
        .references(function () { return user.id; }, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }),
    imageUrl: text("image"),
    createdAt: createdAt,
    updatedAt: updatedAt,
}, function (table) { return [unique("contact_unique").on(table.ownerId, table.contactId)]; });
export var contactRelations = relations(contact, function (_a) {
    var one = _a.one;
    return ({
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
    });
});

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uuid, index, } from "drizzle-orm/pg-core";
import { chatMember } from "./chatMember";
import { contact } from "./contact";
import { message } from "./message/message";
import { reaction } from "./message/reaction";
export var user = pgTable("user", {
    id: uuid("id")
        .default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["pg_catalog.gen_random_uuid()"], ["pg_catalog.gen_random_uuid()"]))))
        .primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
});
export var account = pgTable("account", {
    id: uuid("id")
        .default(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["pg_catalog.gen_random_uuid()"], ["pg_catalog.gen_random_uuid()"]))))
        .primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(function () { return user.id; }, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
}, function (table) { return [index("account_userId_idx").on(table.userId)]; });
export var verification = pgTable("verification", {
    id: uuid("id")
        .default(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["pg_catalog.gen_random_uuid()"], ["pg_catalog.gen_random_uuid()"]))))
        .primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
}, function (table) { return [index("verification_identifier_idx").on(table.identifier)]; });
export var userRelations = relations(user, function (_a) {
    var many = _a.many;
    return ({
        accounts: many(account),
        memberships: many(chatMember),
        contacts: many(contact),
        contactsOf: many(contact),
        messages: many(message),
        reactions: many(reaction),
    });
});
export var accountRelations = relations(account, function (_a) {
    var one = _a.one;
    return ({
        user: one(user, {
            fields: [account.userId],
            references: [user.id],
        }),
    });
});
var templateObject_1, templateObject_2, templateObject_3;

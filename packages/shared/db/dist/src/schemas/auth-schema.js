import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
export var user = pgTable("user", {
    id: text("id").primaryKey(),
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
export var session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(function () { return user.id; }, { onDelete: "cascade" }),
}, function (table) { return [index("session_userId_idx").on(table.userId)]; });
export var account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
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
    id: text("id").primaryKey(),
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
        sessions: many(session),
        accounts: many(account),
    });
});
export var sessionRelations = relations(session, function (_a) {
    var one = _a.one;
    return ({
        user: one(user, {
            fields: [session.userId],
            references: [user.id],
        }),
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

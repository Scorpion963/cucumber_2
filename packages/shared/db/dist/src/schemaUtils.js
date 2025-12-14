import { timestamp } from "drizzle-orm/pg-core";
export var createdAt = timestamp({ withTimezone: true })
    .notNull()
    .defaultNow();
export var updatedAt = timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(function () { return new Date(); });

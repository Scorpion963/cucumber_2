import { redis } from "@/services/redis/redis";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    emailAndPassword: {
        enabled: true
    },
    secondaryStorage: {
        get: async (key) => {
			return await redis.get(key);
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, { ex: ttl });
			// or for ioredis:
			// if (ttl) await redis.set(key, value, 'EX', ttl)
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.del(key);
		}
    }
});
import { redis } from "@/services/redis/redis";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user } from "db";
import { createAuthMiddleware } from "better-auth/api";
import { eq } from "drizzle-orm";
import { throwAPIError } from "./APIErrorFactory";

// TODO: add middleware auth check

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
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
    },
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
        unique: true,
        defaultValue: () => crypto.randomUUID(),
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      if (ctx.body?.username.trim().length === 0) {
        console.log("The username is 0");
        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              username: crypto.randomUUID(),
            },
          },
        };
      }

      const usernameExists = await db.query.user.findFirst({
        where: eq(user.username, ctx.body?.username),
      });

      if (usernameExists)
        throwAPIError("CONFLICT", {
          code: "USERNAME_TAKEN",
          message: "Username taken",
        });
    }),
  },
});

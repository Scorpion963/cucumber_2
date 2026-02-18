import { redis } from "@/services/redis/redis";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user } from "db";
import { createAuthMiddleware } from "better-auth/api";
import { and, eq } from "drizzle-orm";
import { throwAPIError } from "./APIErrorFactory";
import { headers } from "next/headers";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3 } from "@/services/s3/s3";
import { BUCKET_TYPE } from "@/services/s3/lib/helpers";

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
      },
      bio: {
        type: "string",
        input: true,
        required: false,
        unique: false,
      },
      lastName: {
        type: "string",
        required: false,
        input: true,
        unique: false,
      },
      imageProvider: {
        type: "string",
        required: false,
        input: true,
        unique: false,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      console.log("path: ", ctx.path);
      console.log("Session: ", ctx.context.session);

      if (!(ctx.path === "/sign-up/email" || ctx.path === "/update-user"))
        return;

      switch (ctx.path) {
        case "/sign-up/email":
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

          await handleUsernameExistsError(ctx.body?.username?.trim());
          break;

        case "/update-user":
          const sessionUsername = await auth.api.getSession({
            headers: await headers(),
          });
          if (!sessionUsername?.user.username) {
            throw throwAPIError("UNAUTHORIZED");
          }
          const bodyUsername = ctx.body?.username?.trim();

          if (sessionUsername?.user.username !== bodyUsername) {
            await handleUsernameExistsError(bodyUsername);
          }

          const bodyImage = ctx.body?.image;
          if (bodyImage) {
            console.log("body image", bodyImage)
            console.log("running before handle s3imageupdate")
            await handleS3ImageUpdate(sessionUsername.user.username, "cucumber-app-public");
          }

          break;
      }
    }),
  },
});

async function handleS3ImageUpdate(username: string, bucketName: BUCKET_TYPE) {
  const currentImage = await db.query.user.findFirst({
    where: and(eq(user.username, username)),
    columns: { image: true, imageProvider: true },
  });
  console.log("current image: ", currentImage)
  if (!currentImage?.image) return;

  console.log("running before deletion command")
  const command = new DeleteObjectCommand({ Bucket: bucketName, Key: currentImage.image });
  const response = await s3.send(command);
  console.log("Deleted object response: ", response);
  return;
}

async function handleUsernameExistsError(username: string) {
  const usernameExists = await db.query.user.findFirst({
    where: eq(user.username, username),
  });

  if (usernameExists)
    throwAPIError("CONFLICT", {
      code: "USERNAME_TAKEN",
      message: "Username taken",
    });
}

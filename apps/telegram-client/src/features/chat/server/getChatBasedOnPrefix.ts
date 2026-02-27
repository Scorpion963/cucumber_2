import z from "zod";
import getGroupChat from "./db/getGroupChat";
import { getUserWithContactSingle } from "./db/getUserWithContactDB";
import getSingleChat from "./db/getSingleChat";
import {
  HomeChatsType,
  UserWithContactType,
} from "@/providers/types/user-store-provider-types";
import { ReasonPhrases } from "http-status-codes";
import { contact, db, user } from "db";
import { and, eq } from "drizzle-orm";
import createUserWithContact from "@/server/factories/createUserWithContact";

const prefixSchema = z.union([z.literal("@"), z.literal("-")]);
type PrefixType = z.infer<typeof prefixSchema>;

type ReturnType = {
  canAccess: true;
  chat: HomeChatsType | null;
  chatter: UserWithContactType | null;
};

type ErrorType = {
  canAccess: false;
  error: {
    message: string;
    code: ReasonPhrases;
  };
};

type handleChatFetchReturnType = ReturnType | ErrorType;

// TODO: clean up the function

export default async function handleChatFetch(
  id: string,
  currentUserId: string,
): Promise<handleChatFetchReturnType> {
  const { data: prefix, error } = prefixSchema.safeParse(id[0]);
  if (error)
    return {
      canAccess: false,
      error: { message: "Not found", code: ReasonPhrases.NOT_FOUND },
    };
  const slicedId = id.slice(1);

  switch (prefix) {
    case "-": {
      try {
        const groupChat = await getGroupChat(slicedId, currentUserId);

        return {
          canAccess: true,
          chat: {
            ...groupChat.chats,
            type: "group",
            lastMessage: groupChat.message ? { ...groupChat.message } : null,
          },
          chatter: null,
        };
      } catch {
          return {
            canAccess: false,
            error: {
              code: ReasonPhrases.FORBIDDEN,
              message: "You are not a part of this group chat",
            },
          };
      }
    }
    case "@": {
      try {
        const [chatter] = await db
          .select()
          .from(user)
          .leftJoin(contact, and(eq(contact.ownerId, currentUserId), eq(contact.contactId, slicedId)))
          .where(eq(user.id, slicedId));
        const chatterObject = createUserWithContact(
          chatter.user,
          chatter.contacts,
        );

        console.log("Chatter inside the handlechatfetch: ", chatter)

        const chat = await getSingleChat(chatterObject.id, currentUserId);
        console.log("SINGLE_CHAT: ", chat);
        return {
          canAccess: true,
          chat: chat?.chat
            ? {
                ...chat.chat,
                type: "private",
                userId: chatterObject.id,
                lastMessage: chat?.message ? { ...chat.message } : null,
              }
            : null,
          chatter: chatterObject,
        };
      } catch {
        return {
          canAccess: false,
          error: {
            code: ReasonPhrases.NOT_FOUND,
            message: "The user you're looking for doesn't exist",
          },
        };
      }
    }
  }
}

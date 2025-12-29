import z from "zod";
import getGroupChat from "./db/getGroupChat";
import { chats, contact } from "db";
import { getUserWithContactSingle } from "./db/getUserWithContactDB";
import getSingleChat from "./db/getSingleChat";
import { chatterType } from "../stores/chatStore";

const prefixSchema = z.union([z.literal("@"), z.literal("-")]);
type PrefixType = z.infer<typeof prefixSchema>;

type handleChatFetchReturnType = {
  canAccess: boolean;
  chat: typeof chats.$inferSelect | null;
  contact: chatterType | null;
};

export default async function handleChatFetch(
  id: string,
  currentUserId: string
): Promise<handleChatFetchReturnType> {
  const { data: prefix, error } = prefixSchema.safeParse(id[0]);
  if (error) return { canAccess: false, chat: null, contact: null };
  const slicedId = id.slice(1);

  switch (prefix) {
    case "-": {
      const groupChat = await getGroupChat(slicedId, currentUserId);
      if (!groupChat)
        return {
          canAccess: false,
          chat: null,

          contact: null,
        };

      return {
        canAccess: true,
        chat: groupChat,

        contact: null,
      };
    }
    case "@": {
      const chatter = await getUserWithContactSingle(slicedId, currentUserId);
      if (!chatter)
        return {
          canAccess: false,
          chat: null,
          contact: null,
        };
      const chat = await getSingleChat(chatter.id, currentUserId);

      return {
        canAccess: true,
        chat: chat?.chat ?? null,
        contact: {
          id: chatter.id,
          imageUrl: chatter.contactsOf[0]?.imageUrl ?? chatter.image,
          name: chatter.contactsOf[0]?.name ?? chatter.name,
          lastName: chatter.contactsOf[0]?.lastName ?? chatter.lastName,
          notes: chatter.contactsOf[0]?.lastName,
        },
      };
    }
  }
}

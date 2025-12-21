import z from "zod";
import getGroupChat from "./db/getGroupChat";
import getSingleChat from "./db/getSingleChat";
import { chats } from "db";
import getUserFromUserName from "./db/getUserFromUserName";
import getContact from "./db/getContact";

const prefixSchema = z.union([z.literal("@"), z.literal("-")]);
type PrefixType = z.infer<typeof prefixSchema>;

type handleChatFetchReturnType = {
  canAccess: boolean;
  chat: typeof chats.$inferSelect | null;
  chatInfo: Pick<typeof chats.$inferSelect, "imageUrl" | "name"> | null;
};

export default async function handleChatFetch(
  id: string,
  currentUserId: string
): Promise<handleChatFetchReturnType> {
  const { data: prefix, error } = prefixSchema.safeParse(id[0]);
  if (error) return { canAccess: false, chat: null, chatInfo: null };
  const slicedId = id.slice(1);

  switch (prefix) {
    case "-": {
      const groupChat = await getGroupChat(slicedId, currentUserId);
      if (!groupChat) return { canAccess: false, chat: null, chatInfo: null };

      return {
        canAccess: true,
        chat: groupChat,
        chatInfo: {
          imageUrl: groupChat.imageUrl,
          name: groupChat.name,
        },
      };
    }
    case "@": {
      const chatter = await getUserFromUserName(slicedId);
      if (!chatter) return { canAccess: false, chat: null, chatInfo: null };
      const chat = await getSingleChat(chatter.id, currentUserId);
      const contact = await getContact(chatter.id, currentUserId);

      return {
        canAccess: true,
        chat: chat?.chat ?? null,
        chatInfo: {
          imageUrl: contact?.imageUrl ?? chatter.image,
          name: contact?.name ?? chatter.name,
        },
      };
    }
  }
}

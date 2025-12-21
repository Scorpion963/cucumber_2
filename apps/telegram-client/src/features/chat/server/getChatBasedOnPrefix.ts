import z from "zod";
import getGroupChat from "./db/getGroupChat";
import getSingleChat from "./db/getSingleChat";
import { chats } from "db";
import getUserFromUserName from "./db/getUserFromUserName";

const prefixSchema = z.union([z.literal("@"), z.literal("-")]);
type PrefixType = z.infer<typeof prefixSchema>;

type handleChatFetchReturnType = {
  canAccess: boolean;
  chat: typeof chats.$inferSelect | null;
};

export default async function handleChatFetch(
  id: string,
  currentUserId: string
): Promise<handleChatFetchReturnType> {
  const { data: prefix, error } = prefixSchema.safeParse(id[0]);
  if (error) return { canAccess: false, chat: null };
  const slicedId = id.slice(1);

  switch (prefix) {
    case "-": {
      const groupChat = await getGroupChat(slicedId, currentUserId);
      if (!groupChat) return { canAccess: false, chat: null };

      return { canAccess: true, chat: groupChat };
    }
    case "@": {
      const chatterId = await getUserFromUserName(slicedId);
      if (!chatterId) return { canAccess: false, chat: null };
      return {
        canAccess: true,
        chat: await getSingleChat(chatterId.id, currentUserId),
      };
    }
  }
}

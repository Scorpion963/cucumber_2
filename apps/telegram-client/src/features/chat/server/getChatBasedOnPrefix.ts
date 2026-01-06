import z from "zod";
import getGroupChat from "./db/getGroupChat";
import { chats, contact } from "db";
import { getUserWithContactSingle } from "./db/getUserWithContactDB";
import getSingleChat from "./db/getSingleChat";
import { ChatState, chatterType } from "../stores/chatStore";

const prefixSchema = z.union([z.literal("@"), z.literal("-")]);
type PrefixType = z.infer<typeof prefixSchema>;


type handleChatFetchReturnType = {
  canAccess: boolean;
} & ChatState;

export default async function handleChatFetch(
  id: string,
  currentUserId: string
): Promise<handleChatFetchReturnType> {
  const { data: prefix, error } = prefixSchema.safeParse(id[0]);
  if (error) return { canAccess: false, currentChatId: null, chatter: null };
  const slicedId = id.slice(1);

  switch (prefix) {
    case "-": {
      const groupChat = await getGroupChat(slicedId, currentUserId);
      if (!groupChat)
        return {
          canAccess: false,
          currentChatId: null,

          chatter: null,
        };

      return {
        canAccess: true,
        currentChatId: groupChat.id,

        chatter: null,
      };
    }
    case "@": {
      const chatter = await getUserWithContactSingle(slicedId, currentUserId);
      if (!chatter)
        return {
          canAccess: false,
          currentChatId: null,
          chatter: null,
        };
      const chat = await getSingleChat(chatter.id, currentUserId);

      return {
        canAccess: true,

        currentChatId: chat?.chat.id ?? null,
        chatter: {
          bio: chatter.bio,
          imageUrl: chatter.contactsOf[0].imageUrl ?? chatter.image,
          isContact: chatter.contactsOf[0].contactId != null,
          lastName: chatter.contactsOf[0].lastName ?? chatter.lastName,
          name: chatter.contactsOf[0].name ?? chatter.name,
          notes: chatter.contactsOf[0].notes ?? null,
          userId: chatter.id,
          username: chatter.username
        },
      };
    }
  }
}

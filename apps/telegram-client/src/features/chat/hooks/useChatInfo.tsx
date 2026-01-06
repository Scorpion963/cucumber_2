"use client";

import { useHomeChatsStore } from "@/providers/user-store-provider";
import { useChatStore } from "../providers/chatStoreProvider";
import { ContactType, HomeChatsType } from "@/server/mappers/mapChatsToStore";

type useChatInfoReturnType = {
  chat: null | HomeChatsType;
  chatter: null | ContactType;
  chatImageUrl: string | null;
  chatName: string | null;
};

// TODO: the image and text is not updating because i'm using the chatImage and chatName from the chat object
// and whenever a user is updated, the chat fields are not updated, that's why i need to retrieve values from the
// chatter object

export default function useChatInfo(): useChatInfoReturnType {
  const { currentChatId, chatter } = useChatStore((state) => state);
  const { chats, contacts } = useHomeChatsStore((state) => state);
  let chatImageUrl = null;
  let chatName = null;

  if (
    currentChatId &&
    chats.get(currentChatId)?.type === "private" &&
    chatter &&
    contacts.get(chatter.username)
  ) {
    chatImageUrl = contacts.get(chatter.username)?.imageUrl ?? null;
    chatName = contacts.get(chatter.username)?.name ?? null;
  } else if (currentChatId && chats.get(currentChatId)?.type === "private") {
    chatImageUrl = chats.get(currentChatId)?.imageUrl ?? null;
    chatName = chats.get(currentChatId)?.name ?? null;
  }

  return {
    chat: currentChatId ? chats.get(currentChatId) ?? null : null,
    chatter: chatter ? contacts.get(chatter.username) ?? null : null,
    chatImageUrl,
    chatName,
  };
}

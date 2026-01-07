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

export default function useChatInfo(): useChatInfoReturnType {
  const { currentChatId, chatter } = useChatStore((state) => state);
  const { chats, contacts } = useHomeChatsStore((state) => state);

  const resolvedChatter = chatter
    ? contacts.get(chatter.username) ?? null
    : null;

  const chat = currentChatId
    ? chats.get(currentChatId) ?? null
    : null;

    console.log("resolvedChatter: ", resolvedChatter)

  if (!currentChatId) {
    return {
      chat: null,
      chatter: resolvedChatter ? resolvedChatter : chatter,
      chatImageUrl: resolvedChatter?.imageUrl ?? null,
      chatName: resolvedChatter?.name ?? null,
    };
  }

  return {
    chat,
    chatter: resolvedChatter,
    chatImageUrl:
      resolvedChatter?.imageUrl ?? chat?.imageUrl ?? null,
    chatName:
      resolvedChatter?.name ?? chat?.name ?? null,
  };
}
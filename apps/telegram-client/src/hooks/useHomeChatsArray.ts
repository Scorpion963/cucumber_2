"use client";

import { useHomeChatsStore } from "@/providers/user-store-provider";
import { ContactType, HomeChatsType } from "@/server/mappers/mapChatsToStore";
import { useMemo } from "react";

export default function useHomeChatsArray() {
  const chats = useHomeChatsStore((state) => state.chats);
  const contacts = useHomeChatsStore((state) => state.contacts);
  const arrayChats = useMemo(
    () =>
      Array.from(chats.values()).map((item) => getRelevantChat(item, contacts)),
    [chats, contacts]
  );

  return arrayChats;
}

export function getRelevantChat(
  chat: HomeChatsType,
  contacts: Map<string, ContactType>
): HomeChatsType {
  if (chat.type === "private") {
    const chatImage = contacts.get(chat.username)?.imageUrl ?? chat.imageUrl;
    const chatName = contacts.get(chat.username)?.name ?? chat.name;
    return {
      ...chat,
      imageUrl: chatImage,
      name: chatName,
    };
  } else {
    return {
      ...chat,
    };
  }
}



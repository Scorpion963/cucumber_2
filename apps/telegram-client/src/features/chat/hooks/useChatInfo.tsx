"use client";

import { useChatStore } from "../providers/chatStoreProvider";

export default function useChatInfo() {
  const chat = useChatStore((state) => state.chat);
  const contact = useChatStore((state) => state.contact);

  if (contact) {
    return {
      chatImageUrl: contact.imageUrl,
      chatName: contact.name,
    };
  } else if (chat) {
    return { chatImageUrl: chat.imageUrl, chatName: chat.name };
  } else {
    return { chatImageUrl: null, chatName: null };
  }
}

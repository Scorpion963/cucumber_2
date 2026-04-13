"use client"

import { idb } from "@/db/db";
import { useChatStore } from "@/features/chat/providers/chatStoreProvider";
import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import { MessageType } from "@/features/chat/stores/messageStore";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { toast } from "sonner";

type SocketErrorPayloadType<T> = {
  code: string;
  message: string;
  data: T | null;
};

export function useHandleChatCreationError() {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const currentChatterId = useChatStore((state) => state.currentChatterId);
  const currentChatId = useChatStore((state) => state.currentChatId);
  const updateChats = useHomeChatsStore((state) => state.updateChat);

  async function handler(
    data: SocketErrorPayloadType<{
      id: string;
      receiverId: string;
      chatId: string;
    }>,
  ) {
    console.log("Received the error");
    toast.error(data.message);
    const payload = data.data;
    if (!payload) return;

    if (currentChatId === payload.chatId) {
      const newMessages: MessageType[] = messages.map((item) =>
        item.id === payload.id ? { ...item, status: "error" } : item,
      );

      setMessages(newMessages);
      updateChats(currentChatId!, { status: "error" });
    }

    await idb.messages.update(payload.id, { status: "error" });
    await idb.chats.update(payload.chatId, { status: "error" });
  }

  useReceiveSocketEvent("CHAT_CREATION_FAILED", handler);
}
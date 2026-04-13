"use client"

import { idb } from "@/db/db";
import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import { MessageType } from "@/features/chat/stores/messageStore";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { message } from "db";

export function useSocketMessageCreatedError() {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  async function handleError(data: typeof message.$inferSelect) {
    const updatedMessages: MessageType[] = messages.map((item) => {
      return item.id === data.id ? { ...item, status: "error" } : item;
    });
    setMessages(updatedMessages);

    const response = await idb.messages.put({
      ...data,
      status: "error",
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
    console.log("Dexie response: ", response);
  }

  useReceiveSocketEvent("SEND_TEXT_MESSAGE", handleError);
}
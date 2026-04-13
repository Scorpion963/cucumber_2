"use client"

import { idb } from "@/db/db";
import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { message } from "db";

export function useHandleMessageCreated() {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const updateLastMessage = useHomeChatsStore(
    (state) => state.updateLastMessage,
  );

  async function handleMessageCreated(data: typeof message.$inferSelect) {
    const updatedMessages = messages.filter((item) => item.id !== data.id);

    setMessages([
      ...updatedMessages,
      {
        ...data,
        status: "sent",
      },
    ]);
    console.log("message received");
    updateLastMessage(data.chatId, { ...data, status: "sent" });
    const id = await idb.messages.put({ ...data, status: "sent" });
    console.log("i'm here: ", id);
  }

  useReceiveSocketEvent("MESSAGE_CREATED", handleMessageCreated);
}
"use client"

import { idb } from "@/db/db";
import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import { MessageType } from "@/features/chat/stores/messageStore";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { ErrorPayload } from "types";

export function useSocketMessageCreatedError() {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  async function handleError(data: ErrorPayload<{id: string | undefined}>) {
    if(!data.data.id) return

    const updatedMessages: MessageType[] = messages.map((item) => {
      return item.id === data.data.id ? { ...item, status: "error" } : item;
    });
    setMessages(updatedMessages);

    const response = await idb.messages.update(data.data.id ,{
      status: "error",
    });
    console.log("Dexie response: ", response);
  }

  useReceiveSocketEvent("MESSAGE_CREATION_ERROR", handleError);
}
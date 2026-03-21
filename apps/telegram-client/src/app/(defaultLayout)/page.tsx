"use client";

import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { message } from "db";

export function SocketEventGlobalReceiver() {
  useHandleMessageCreated()
  useHandleMessageAck()

  return null;
}

function useHandleMessageCreated() {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const updateLastMessage = useHomeChatsStore(
    (state) => state.updateLastMessage,
  );

  function handleMessageCreated(data: typeof message.$inferSelect) {
    const updatedMessages = messages.filter((item) => item.id !== data.id);

    setMessages([
      ...updatedMessages,
      {
        ...data,
        status: "sent"
      },
    ]);

    updateLastMessage(data.chatId, {...data, status: "sent"});
  }

  useReceiveSocketEvent("MESSAGE_CREATED", handleMessageCreated);
}

function useHandleMessageAck() {
  function handleAckMessageCreated() {

    return;
  }

  useReceiveSocketEvent("ACK_MESSAGE_CREATED", handleAckMessageCreated);
}

export default function Home() {
  return <div className="w-full h-screen"></div>;
}

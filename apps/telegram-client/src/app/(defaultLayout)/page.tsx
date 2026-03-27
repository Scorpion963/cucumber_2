"use client";

import { idb } from "@/db/db";
import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import { MessageType } from "@/features/chat/stores/messageStore";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { useSocketStore } from "@/providers/socket-store-provider";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { SOCKET_EMITS } from "@/types/socket-events-types";
import { message } from "db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";

export function SocketEventGlobalReceiver() {
  useSocketInitialized();
  useHandleMessageCreated();
  useHandleMessageAck();
  useSocketMessageCreatedError();

  return null;
}

function useHandleMessageCreated() {
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

    updateLastMessage(data.chatId, { ...data, status: "sent" });
    const id = await idb.messages.put({ ...data, status: "sent" });
    console.log("i'm here: ", id);
  }

  useReceiveSocketEvent("MESSAGE_CREATED", handleMessageCreated);
}

function useHandleMessageAck() {
  function handleAckMessageCreated() {
    return;
  }

  useReceiveSocketEvent("ACK_MESSAGE_CREATED", handleAckMessageCreated);
}

function useSocketInitialized() {
  const messages = useLiveQuery(async () =>
    idb.messages.where("status").equals("sending").toArray(),
  );
  const socket = useSocketStore((state) => state.socket);

  console.log("indexed db messages: ", messages);

  useEffect(() => {
    if (socket === null) return;
    if (!messages) return;

    messages.forEach((item) => {
      socket.emit(SOCKET_EMITS.SEND_TEXT_MESSAGE, item);
    });
  }, [socket]);

  return;
}

function useSocketMessageCreatedError() {
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  async function handleError(data: typeof message.$inferSelect) {
    const updatedMessages = messages.filter((item) => item.id !== data.id);
    setMessages([
      ...updatedMessages,
      {
        ...data,
        status: "error",
      },
    ]);
    const response = await idb.messages.put({...data, status: "error"});
    console.log("Dexie response: ", response)
  }

  useReceiveSocketEvent("SEND_TEXT_MESSAGE", handleError);
}

export default function Home() {
  return <div className="w-full h-screen"></div>;
}

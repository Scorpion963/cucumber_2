"use client";

import { idb } from "@/db/db";
import { useChatStore } from "@/features/chat/providers/chatStoreProvider";
import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { useSocketStore } from "@/providers/socket-store-provider";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { SOCKET_EMITS } from "@/types/socket-events-types";
import { chats, contact, message, user } from "db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";

export function SocketEventGlobalReceiver() {
  useSocketInitialized();
  useHandleMessageCreated();
  useHandleMessageAck();
  useSocketMessageCreatedError();
  useHandleChatCreated();

  return null;
}

type CreatorReturnPayload = {
  tempId: string;
  chat: typeof chats.$inferSelect;
  message: typeof message.$inferSelect;
  isCreator: true;
  userId: string;
};

type CreatorType = typeof user.$inferSelect & {
  contactInfo: typeof contact.$inferSelect | null;
};

type ReturnPayload = ReceiverReturnPayload | CreatorReturnPayload;

type ReceiverReturnPayload = {
  chat: typeof chats.$inferSelect;
  message: typeof message.$inferSelect;
  isCreator: false;
  creator: CreatorType;
};

function useHandleChatCreated() {
  const { replaceChat, addChat, users, addUser } = useHomeChatsStore(
    (state) => state,
  );
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const { currentUser } = useCurrentUserStore((state) => state);
  const { currentChatterId, setCurrentChatId } = useChatStore((state) => state);

  async function handleChatRoomCreated(data: ReturnPayload) {
    console.log("chat: ", data.chat);

    if (data.isCreator) {
      replaceChat(data.tempId, {
        id: data.chat.id,
        type: "private",
        lastMessage: {
          id: data.message.id,
          status: "sent",
          text: data.message.text,
          updatedAt: data.message.updatedAt,
        },
        userId: data.userId,
      });

      const id = await idb.messages.delete(data.tempId);
      const updatedId = await idb.messages.put({
        ...data.message,
        status: "sent",
      });

      console.log("deleted id: ", id);
      console.log("updated id: ", updatedId);

      if (currentChatterId === data.userId) {
        setCurrentChatId(data.chat.id);

        const updatedMessages = messages.filter(
          (item) => item.id !== data.message.id,
        );

        setMessages([
          ...updatedMessages,
          {
            ...data.message,
            status: "sent",
          },
        ]);
      }
    } else {
      addChat({
        id: data.chat.id,
        type: "private",
        lastMessage: {
          id: data.message.id,
          status: "sent",
          text: data.message.text,
          updatedAt: data.message.updatedAt,
        },
        userId: data.creator.id,
      });
      addUser({ ...data.creator });

      const id = await idb.messages.put({ ...data.message, status: "sent" });
      console.log("receiver idb id: ", id);

      if (currentChatterId === data.creator.id) {
        setCurrentChatId(data.chat.id);

        const updatedMessages = messages.filter(
          (item) => item.id !== data.message.id,
        );

        setMessages([
          ...updatedMessages,
          {
            ...data.message,
            status: "sent",
          },
        ]);
      }
    }
  }

  useReceiveSocketEvent("NEW_CHAT_ROOM_CREATED", handleChatRoomCreated);
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
    console.log("message received");
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

export default function Home() {
  return <div className="w-full h-screen"></div>;
}

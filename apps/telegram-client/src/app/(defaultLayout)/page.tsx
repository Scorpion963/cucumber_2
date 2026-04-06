"use client";

import { idb } from "@/db/db";
import { useChatStore } from "@/features/chat/providers/chatStoreProvider";
import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import { MessageType } from "@/features/chat/stores/messageStore";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { useSocketStore } from "@/providers/socket-store-provider";
import { HomeChatsType } from "@/providers/types/user-store-provider-types";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { SOCKET_EMITS } from "@/types/socket-events-types";
import { chats, contact, message, user } from "db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { toast } from "sonner";

export function SocketEventGlobalReceiver() {
  useSocketInitialized();
  useHandleMessageCreated();
  useHandleMessageAck();
  useSocketMessageCreatedError();
  useHandleChatCreated();
  useHandleChatCreationError();

  const chats = useHomeChatsStore((state) => state.chats);

  useEffect(() => {
    console.log("chats changed: ", chats);
  }, [chats]);

  return null;
}

type CreatorReturnPayload = {
  tempId: string;
  chat: typeof chats.$inferSelect;
  message: typeof message.$inferSelect;
  isCreator: true;
  receiverId: string;
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
    const isActiveChat = data.isCreator
      ? data.receiverId === currentChatterId
      : data.creator.id;
    const sentMessage: MessageType = {
      ...data.message,
      status: "sent",
    };
    const chatPayload: HomeChatsType = {
      status: "active",
      ...data.chat,
      type: "private",
      lastMessage: {
        ...data.message,
        status: "sent",
      },
      userId: data.isCreator ? data.receiverId : data.creator.id,
    };

    if (data.isCreator) {
      await idb.messages.update(data.tempId, { chatId: data.chat.id });
      await idb.chats.update(data.tempId, {
        id: data.chat.id,
        status: "active",
        lastMessage: { ...data.message, status: "sent" },
      });
    }

    if (isActiveChat) {
      setCurrentChatId(data.chat.id);

      const filteredMessages = messages.filter(
        (item) => item.id !== sentMessage.id,
      );
      setMessages([...filteredMessages, sentMessage]);

      if (data.isCreator) {
        replaceChat(data.tempId, chatPayload);
      } else {
        addUser(data.creator);
        addChat(chatPayload);
      }
    }

    const id = await idb.messages.put({ ...data.message, status: "sent" });
  }

  useReceiveSocketEvent("NEW_CHAT_ROOM_CREATED", handleChatRoomCreated);
}

type SocketErrorPayloadType<T> = {
  code: string;
  message: string;
  data: T | null;
};

function useHandleChatCreationError() {
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

export default function Home() {
  return <div className="w-full h-screen"></div>;
}

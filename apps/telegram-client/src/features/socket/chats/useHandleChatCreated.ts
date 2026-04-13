"use client"

import { idb } from "@/db/db";
import { useChatStore } from "@/features/chat/providers/chatStoreProvider";
import { useMessageStore } from "@/features/chat/providers/messageStoreProvider";
import { MessageType } from "@/features/chat/stores/messageStore";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { HomeChatsType } from "@/providers/types/user-store-provider-types";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { chats, contact, message, user } from "db";

type ReturnPayload = ReceiverReturnPayload | CreatorReturnPayload;

type ReceiverReturnPayload = {
  chat: typeof chats.$inferSelect;
  message: typeof message.$inferSelect;
  isCreator: false;
  creator: CreatorType;
};

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

export function useHandleChatCreated() {
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

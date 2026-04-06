"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ChatStore, createChatStore } from "../stores/chatStore";
import { useStore } from "zustand";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import {
  HomeChatsType,
  UserWithContactType,
} from "@/providers/types/user-store-provider-types";
import { v4 } from "uuid";
import { idb } from "@/db/db";

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<null | ChatStoreApi>(null);

export type ChatStoreProviderProps = {
  currentChatId?: string | null;
  currentChatterId?: string | null;
  chat?: HomeChatsType | null;
  chatter?: UserWithContactType | null;
  children: ReactNode;
};

export function ChatStoreProvider({
  children,
  currentChatId = null,
  chat = null,
  chatter = null,
  currentChatterId = null,
}: ChatStoreProviderProps) {
  const [store] = useState(() =>
    createChatStore({ currentChatId, currentChatterId }),
  );
  const { addChat, addUser } = useHomeChatsStore((state) => state);

  useEffect(() => {
    function handleAddingUserAndChats() {
      if (chatter) {
        console.log("Adding chatter to the store: ");
        addUser({ ...chatter });
      }

      if (!chat) return;

      if (chat.type === "private") {
        addChat({
          type: "private",
          id: chat.id,
          lastMessage: chat.lastMessage
            ? { ...chat.lastMessage, status: "sent" }
            : null,
          userId: chatter?.id ?? null,
        });
      } else {
        addChat({
          type: "group",
          id: chat.id,
          imageUrl: chat.imageUrl,
          lastMessage: chat.lastMessage
            ? { ...chat.lastMessage, status: "sent" }
            : null,
          name: chat.name,
        });
      }
    }

    handleAddingUserAndChats();
  }, [addChat, addUser, chatter, chat]);

  return (
    <ChatStoreContext.Provider value={store}>
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useHandleAddUserAndChats({
  chat,
  chatter,
}: Omit<
  ChatStoreProviderProps,
  "children" | "currentChatId" | "currentChatterId"
>) {
  const { addChat, addUser } = useHomeChatsStore((state) => state);
  const { setCurrentChatId, setCurrentChatterId } = useChatStore(
    (state) => state,
  );

  useEffect(() => {
    async function handleAddingUserAndChats() {
      if (chatter) {
        console.log("Adding chatter to the store: ");
        addUser({ ...chatter });
        setCurrentChatterId(chatter.id);

        if (!chat) {
          const chatExists = await idb.chats
            .where("userId")
            .equals(chatter.id)
            .toArray();

          if (chatExists.length !== 0) {
            addChat(chatExists[0]);
            setCurrentChatId(chatExists[0].id);
          } else {
            const localChatId = v4();

            const privateChat: HomeChatsType = {
              type: "private",
              id: localChatId,
              lastMessage: null,
              userId: chatter.id,
              status: "local",
            };

            addChat(privateChat);
            setCurrentChatId(privateChat.id);

            if (chatExists.length === 0) {
              await idb.chats.put(privateChat);
            }
          }
        }
      }

      if (!chat) return;

      const newChat: HomeChatsType =
        chat.type === "private"
          ? {
              ...chat,
              userId: chatter?.id ?? null,
            }
          : chat;

      addChat(newChat);
      setCurrentChatId(newChat.id);
      await idb.chats.put(newChat);
    }

    handleAddingUserAndChats();
  }, [addChat, addUser, chatter, chat, setCurrentChatId, setCurrentChatterId]);
}

export function useChatStore<T>(selector: (store: ChatStore) => T): T {
  const chatStoreContext = useContext(ChatStoreContext);

  if (!chatStoreContext)
    throw new Error("useChatStore must be used within ChatStoreProvider");

  return useStore(chatStoreContext, selector);
}

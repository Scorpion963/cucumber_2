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

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<null | ChatStoreApi>(null);

export type ChatStoreProviderProps = {
  currentChatId: string | null;
  currentChatterId: string | null;
  chat: HomeChatsType | null;
  chatter: UserWithContactType | null;
  children: ReactNode;
};

export function ChatStoreProvider({
  children,
  currentChatId,
  chat,
  chatter,
  currentChatterId,
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
          lastMessage: chat.lastMessage,
          userId: chatter?.id ?? null,
        });
      } else {
        addChat({
          type: "group",
          id: chat.id,
          imageUrl: chat.imageUrl,
          lastMessage: chat.lastMessage,
          name: chat.name,
        });
      }
    }

    handleAddingUserAndChats();
  }, [addChat, addUser, chatter, chat ]);

  return (
    <ChatStoreContext.Provider value={store}>
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStore<T>(selector: (store: ChatStore) => T): T {
  const chatStoreContext = useContext(ChatStoreContext);

  if (!chatStoreContext)
    throw new Error("useChatStore must be used within ChatStoreProvider");

  return useStore(chatStoreContext, selector);
}

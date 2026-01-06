"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { ChatStore, chatterType, createChatStore } from "../stores/chatStore";
import { useStore } from "zustand";
import { chats } from "db";
import { ChatState } from "../stores/chatStore";

// TODO: Create a global chattype to use in case i need to change something

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<null | ChatStoreApi>(null);

export type ChatStoreProviderProps = ChatState & {
  children: ReactNode;
};

export function ChatStoreProvider({
  children,
  currentChatId,
  chatter,
}: ChatStoreProviderProps) {
  const [store] = useState(() => createChatStore({ currentChatId, chatter }));

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

"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { ChatStore, chatterType, createChatStore } from "../stores/chatStore";
import { useStore } from "zustand";
import { chats } from "db";

// TODO: Create a global chattype to use in case i need to change something

export type ChatStoreApi = ReturnType<typeof createChatStore>;

export const ChatStoreContext = createContext<null | ChatStoreApi>(null);

export type ChatStoreProviderProps = {
  children: ReactNode;
  chat: typeof chats.$inferSelect | null;
  contact: chatterType | null
};

export function ChatStoreProvider({
  children,
  chat,
  contact
}: ChatStoreProviderProps) {
  const [store] = useState(() => createChatStore({ chat, contact }));

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

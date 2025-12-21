"use client"
import { createContext, ReactNode, useContext, useState } from "react";
import { message } from "db";
import { useStore } from "zustand";
import { createMessageStore, MessageStore } from "../stores/messageStore";


export type MessageStoreApi = ReturnType<typeof createMessageStore>;

export const MessageStoreContext = createContext<null | MessageStoreApi>(null);

export type MessageStoreProviderProps = {
  children: ReactNode;
  value: (typeof message.$inferSelect)[];
};

export function MessageStoreProvider({
  children,
  value,
}: MessageStoreProviderProps) {
  const [store] = useState(() => createMessageStore({ messages: value }));

  return (
    <MessageStoreContext.Provider value={store}>
      {children}
    </MessageStoreContext.Provider>
  );
}

export function useMessageStore<T,>(selector: (store: MessageStore) => T): T {
  const messageStore = useContext(MessageStoreContext);
  if (!messageStore)
    throw new Error("useMessageStore must be used within MessageStoreProvider");

  return useStore(messageStore, selector);
}

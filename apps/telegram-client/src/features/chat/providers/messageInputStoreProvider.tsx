"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { useStore } from "zustand";
import {
  createMessageInputStore,
  MessageInputStore,
  MessageInputType,
} from "../stores/message-input-store";

export type MessageInputStoreApi = ReturnType<typeof createMessageInputStore>;

export const MessageInputStoreContext =
  createContext<null | MessageInputStoreApi>(null);

export type MessageInputStoreProviderProps = {
  children: ReactNode;
  message: MessageInputType;
};

export function MessageInputStoreProvider({
  children,
  message,
}: MessageInputStoreProviderProps) {
  const [store] = useState(() => createMessageInputStore({ message }));

  return (
    <MessageInputStoreContext.Provider value={store}>
      {children}
    </MessageInputStoreContext.Provider>
  );
}

export function useMessageInputStore<T>(selector: (store: MessageInputStore) => T): T {
  const messageInputStore = useContext(MessageInputStoreContext);
  if (!messageInputStore)
    throw new Error("useMessageStore must be used within MessageStoreProvider");

  return useStore(messageInputStore, selector);
}

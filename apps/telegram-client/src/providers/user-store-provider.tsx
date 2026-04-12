"use client";

import { createHomeChatsStore, HomeChatsStore } from "@/stores/userStore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStore } from "zustand";
import {
  HomeChatsType,
  UserWithContactType,
} from "./types/user-store-provider-types";
import { idb } from "@/db/db";

export type HomeChatsApi = ReturnType<typeof createHomeChatsStore>;

export const HomeChatsStoreContext = createContext<null | HomeChatsApi>(null);

export type HomeChatsProviderProps = {
  children: ReactNode;
  chats: Map<string, HomeChatsType>;
  users: Map<string, UserWithContactType>;
  chatIds: string[];
};

export function HomeChatsProvider({
  children,
  chats,
  users,
  chatIds,
}: HomeChatsProviderProps) {
  const [store] = useState(() => createHomeChatsStore({ chats, users }));

  useEffect(() => {
    // deleting all the stale chats that have deleted on the server but not on the client

    async function handleDeletedChats() {
      const ids = await idb.chats
        .where("status")
        .equals("active")
        .filter((chat) => !chatIds.includes(chat.id))
        .toArray();
      const idsFromLocal = ids.map((item) => item.id);
      await idb.chats.bulkDelete(idsFromLocal);
      await idb.messages.bulkDelete(idsFromLocal);
    }

    handleDeletedChats();
  }, [chatIds]);

  return (
    <HomeChatsStoreContext.Provider value={store}>
      {children}
    </HomeChatsStoreContext.Provider>
  );
}

export function useHomeChatsStore<T>(
  selector: (store: HomeChatsStore) => T,
): T {
  const homeChatsStoreContext = useContext(HomeChatsStoreContext);
  if (!homeChatsStoreContext)
    throw new Error("useHomeChatsStore must be used within UserStoreProvider");

  return useStore(homeChatsStoreContext, selector);
}

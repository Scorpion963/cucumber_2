"use client";

import { createHomeChatsStore, HomeChatsStore } from "@/stores/userStore";
import { user } from "db";
import { createContext, ReactNode, useContext, useState } from "react";
import { useStore } from "zustand";

export type HomeChatsApi = ReturnType<typeof createHomeChatsStore>;

export const HomeChatsStoreContext = createContext<null | HomeChatsApi>(null);

export type HomeChatsProviderProps = {
  children: ReactNode;
  users: (typeof user.$inferSelect)
};

export function HomeChatsProvider({ children,users }: HomeChatsProviderProps) {
  const [store] = useState(() => createHomeChatsStore());

  return (
    <HomeChatsStoreContext.Provider value={store}>
      {children}
    </HomeChatsStoreContext.Provider>
  );
}

export function useHomeChatsStore<T>(selector: (store: HomeChatsStore) => T): T {
  const homeChatsStoreContext = useContext(HomeChatsStoreContext);
  if (!homeChatsStoreContext)
    throw new Error("useUserStore must be used within UserStoreProvider");

  return useStore(homeChatsStoreContext, selector);
}

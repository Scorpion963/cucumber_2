"use client";

import { createUserStore, UserStore } from "@/stores/userStore";
import { createContext, ReactNode, useContext, useState } from "react";
import { useStore } from "zustand";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<null | UserStoreApi>(null);

export type UserStoreProviderProps = {
  children: ReactNode;
};

export function UserStoreProvider({ children }: UserStoreProviderProps) {
  const [store] = useState(() => createUserStore());

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
}

export function useUserStore<T>(selector: (store: UserStore) => T): T {
  const userStoreContext = useContext(UserStoreContext);
  if (!userStoreContext)
    throw new Error("useUserStore must be used within UserStoreProvider");

  return useStore(userStoreContext, selector);
}

"use client";

// import { ContactType, HomeChatsType } from "@/server/mappers/mapChatsToStore";
// import { createHomeChatsStore, HomeChatsStore } from "@/stores/userStore";
// import { user } from "db";
// import { createContext, ReactNode, useContext, useState } from "react";
// import { useStore } from "zustand";

// export type HomeChatsApi = ReturnType<typeof createHomeChatsStore>;

// export const HomeChatsStoreContext = createContext<null | HomeChatsApi>(null);

// export type HomeChatsProviderProps = {
//   children: ReactNode;
//   chats: Map<string, HomeChatsType>;
//   contacts: Map<string, ContactType>;
// };

// export function HomeChatsProvider({
//   children,
//   chats,
//   contacts,
// }: HomeChatsProviderProps) {
//   const [store] = useState(() => createHomeChatsStore({ chats, contacts }));

//   return (
//     <HomeChatsStoreContext.Provider value={store}>
//       {children}
//     </HomeChatsStoreContext.Provider>
//   );
// }

// export function useHomeChatsStore<T>(
//   selector: (store: HomeChatsStore) => T
// ): T {
//   const homeChatsStoreContext = useContext(HomeChatsStoreContext);
//   if (!homeChatsStoreContext)
//     throw new Error("useUserStore must be used within UserStoreProvider");

//   return useStore(homeChatsStoreContext, selector);
// }



import { createHomeChatsStore, HomeChatsStore } from "@/stores/userStore";
import { createContext, ReactNode, useContext, useState } from "react";
import { useStore } from "zustand";
import { HomeChatsType, UserWithContactType } from "./types/user-store-provider-types";

export type HomeChatsApi = ReturnType<typeof createHomeChatsStore>;

export const HomeChatsStoreContext = createContext<null | HomeChatsApi>(null);

export type HomeChatsProviderProps = {
  children: ReactNode;
  chats: Map<string, HomeChatsType>;
  users: Map<string, UserWithContactType>;
};

export function HomeChatsProvider({
  children,
  chats,
  users,
}: HomeChatsProviderProps) {
  const [store] = useState(() => createHomeChatsStore({ chats, users }));

  return (
    <HomeChatsStoreContext.Provider value={store}>
      {children}
    </HomeChatsStoreContext.Provider>
  );
}

export function useHomeChatsStore<T>(
  selector: (store: HomeChatsStore) => T
): T {
  const homeChatsStoreContext = useContext(HomeChatsStoreContext);
  if (!homeChatsStoreContext)
    throw new Error("useUserStore must be used within UserStoreProvider");

  return useStore(homeChatsStoreContext, selector);
}
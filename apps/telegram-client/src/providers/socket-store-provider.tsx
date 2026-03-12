"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ReactNode } from "react";
import { useStore } from "zustand";
import { createSocketStore, SocketStore } from "@/stores/socket-store";
import { useSocket } from "@/hooks/useSocket";

export type SocketStoreApi = ReturnType<typeof createSocketStore>;

export const SocketStoreContext = createContext<null | SocketStoreApi>(null);

export type SocketStoreProviderProps = {
  children: ReactNode;
};

export function SocketStoreProvider({ children }: SocketStoreProviderProps) {
  const socket = useSocket();
  const [store] = useState(() => createSocketStore({ socket }));
  const { setSocket } = useStore(store);

  useEffect(() => {
    setSocket(socket);
  }, [socket]);

  return <SocketStoreContext value={store}>{children}</SocketStoreContext>;
}

export function useSocketStore<T>(selector: (store: SocketStore) => T) {
  const socketStoreContext = useContext(SocketStoreContext);

  if (!socketStoreContext)
    throw new Error(
      "useSocketStore must be used within CurrentUserStoreProvider",
    );

  return useStore(socketStoreContext, selector);
}



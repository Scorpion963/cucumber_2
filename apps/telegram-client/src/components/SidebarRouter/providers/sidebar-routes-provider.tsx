"use client"
import { createContext, ReactNode, useContext, useState } from "react";
import { createSidebarRouterStore, SidebarRouterStore } from "../stores/sidebar-routes";
import { useStore } from "zustand";

export type SidebarRouterApi = ReturnType<typeof createSidebarRouterStore>;

export const SidebarRouterContext = createContext<null | SidebarRouterApi>(
  null
);

export type SidebarRouterProviderProps = {
  children: ReactNode;
  routes?: string[];
};

export function SidebarRouterProvider({
  children,
  routes,
}: SidebarRouterProviderProps) {
    const [state] = useState(() => createSidebarRouterStore({routes: routes ?? [], previousRoutes: []}))

  return (
    <SidebarRouterContext.Provider value={state}>{children}</SidebarRouterContext.Provider>
  );
}

export function useSidebarRouterStore<T>(selector: (store: SidebarRouterStore) => T): T {
    const sidebarStoreContext = useContext(SidebarRouterContext)

    if(!sidebarStoreContext) throw new Error("useSidebarRouterStore must be used within SidebarRouterProvider")

    return useStore(sidebarStoreContext, selector)
}

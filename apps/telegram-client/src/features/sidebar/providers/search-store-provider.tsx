"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useStore } from "zustand";
import { createSearchStore, SearchStore } from "../stores/search-store";

export type SearchStoreApi = ReturnType<typeof createSearchStore>;

export const SearchStoreContext = createContext<null | SearchStoreApi>(null);

export type SearchStoreProviderProps = {
  children: ReactNode;
};

export function SearchStoreProvider({ children }: SearchStoreProviderProps) {
  const [store] = useState(() => createSearchStore());

  return (
    <SearchStoreContext.Provider value={store}>
      {children}
    </SearchStoreContext.Provider>
  );
}

export function useSearchStore<T>(selector: (store: SearchStore) => T): T {
  const searchStoreContext = useContext(SearchStoreContext);
  if (!searchStoreContext)
    throw new Error("useSearchStore must be used within SearchStoreProvider");

  return useStore(searchStoreContext, selector);
}

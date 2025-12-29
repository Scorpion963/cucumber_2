import { user } from "db";
import { createStore } from "zustand/vanilla";

export type SearchState = {
  usersFound: (typeof user.$inferSelect)[];
  error: {
    message: string;
  } | null;
  searchValue: string;
};

export type SearchActions = {
  setUsers: (usersToBeAdded: (typeof user.$inferSelect)[]) => void;
  setErrorMessage: (message: string | null) => void;
  removeError: () => void;
  setSearchValue: (value: string) => void;
};

export type SearchStore = SearchState & SearchActions;

export const defaultInitState: SearchState = {
  usersFound: [],
  error: null,
  searchValue: "",
};

export const createSearchStore = (
  initState: SearchState = defaultInitState
) => {
  return createStore<SearchStore>()((set) => ({
    ...initState,
    setUsers: (usersToBeAdded) =>
      set((state) => ({ ...state, usersFound: usersToBeAdded })),
    removeError: () => set((state) => ({ ...state, error: null })),
    setErrorMessage: (message) =>
      set((state) => ({
        ...state,
        error: message === null ? null : { message: message },
      })),
    setSearchValue: (value) =>
      set((state) => ({ ...state, searchValue: value })),
  }));
};

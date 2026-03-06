import { ErrorType } from "@/types/response-types";
import { user } from "db";
import { ReasonPhrases } from "http-status-codes";
import { createStore } from "zustand/vanilla";

export type UserFoundType = typeof user.$inferSelect;

export type SearchState = {
  usersFound: UserFoundType[];
  error: ErrorType | null;
  searchValue: string;
};

export type SearchActions = {
  setUsers: (usersToBeAdded: (typeof user.$inferSelect)[]) => void;
  setErrorMessage: (message: string, code: string) => void;
  removeError: () => void;
  setSearchValue: (value: string) => void;
  resetError: () => void;
};

export type SearchStore = SearchState & SearchActions;

export const defaultInitState: SearchState = {
  usersFound: [],
  error: null,
  searchValue: "",
};

export const createSearchStore = (
  initState: SearchState = defaultInitState,
) => {
  return createStore<SearchStore>()((set) => ({
    ...initState,
    setUsers: (usersToBeAdded) =>
      set((state) => ({ ...state, usersFound: usersToBeAdded })),
    removeError: () => set((state) => ({ ...state, error: null })),
    setErrorMessage: (message, code) =>
      set((state) => ({
        ...state,
        error: message === null ? null : { message, code },
      })),
    resetError: () => {
      set((state) => ({ ...state, error: null }));
    },
    setSearchValue: (value) =>
      set((state) => ({ ...state, searchValue: value })),
  }));
};

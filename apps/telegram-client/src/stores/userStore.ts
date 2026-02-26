import { HomeChatsType, UserWithContactType } from "@/providers/types/user-store-provider-types";
import { createStore } from "zustand/vanilla";

export type HomeChatsState = {
  chats: Map<string, HomeChatsType>;
  users: Map<string, UserWithContactType>;
};

export type HomeChatsActions = {
  updateContactByUsername: (
    username: string,
    users: Pick<UserWithContactType, "contactInfo" | "name" | "lastName">
  ) => void;
  addUser: (contact: UserWithContactType) => void;
};

export type HomeChatsStore = HomeChatsState & HomeChatsActions;

export const defaultInitState: HomeChatsState = {
  chats: new Map<string, HomeChatsType>(),
  users: new Map<string, UserWithContactType>(),
};

export const createHomeChatsStore = (
  initState: HomeChatsState = defaultInitState
) => {
  return createStore<HomeChatsStore>()((set) => ({
    ...initState,
    updateContactByUsername: (username, user) => {
      set((state) => {
        const contactExists = state.users.get(username);
        if (!contactExists) return { ...state };

        const newContact: UserWithContactType = {
          ...contactExists,
          ...user,
        };
        const newMap = new Map(state.users);
        newMap.set(username, newContact);
        return { ...state, contacts: newMap };
      });
    },

    addUser: (contact) =>
      set((state) => {
        const users = new Map(state.users);
        users.set(contact.username, contact);

        return { ...state, users };
      }),
  }));
};

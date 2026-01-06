import { ContactType, HomeChatsType } from "@/server/mappers/mapChatsToStore";
import { createStore } from "zustand/vanilla";

export type HomeChatsState = {
  chats: Map<string, HomeChatsType>;
  contacts: Map<string, ContactType>;
};

export type HomeChatsActions = {
  updateContactByUsername: (
    username: string,
    contact: Pick<ContactType, "notes" | "imageUrl" | "name" | "lastName">
  ) => void;
  addContact: (contact: ContactType) => void;
};

export type HomeChatsStore = HomeChatsState & HomeChatsActions;

export const defaultInitState: HomeChatsState = {
  chats: new Map<string, HomeChatsType>(),
  contacts: new Map<string, ContactType>(),
};

export const createHomeChatsStore = (
  initState: HomeChatsState = defaultInitState
) => {
  return createStore<HomeChatsStore>()((set) => ({
    ...initState,
    updateContactByUsername: (username, contact) => {
      set((state) => {
        const contactExists = state.contacts.get(username);
        if (!contactExists) return { ...state };

        const newContact: ContactType = {
          ...contactExists,
          ...contact,
        };
        const newMap = new Map(state.contacts);
        newMap.set(username, newContact);
        return { ...state, contacts: newMap };
      });
    },
    addContact: (contact) =>
      set((state) => {
        const contacts = new Map(state.contacts);
        contacts.set(contact.username, contact);

        return { ...state, contacts };
      }),
  }));
};

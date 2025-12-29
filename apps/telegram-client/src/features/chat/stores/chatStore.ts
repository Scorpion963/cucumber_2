import { chats, contact } from "db";
import { produce } from "immer";
import { createStore } from "zustand/vanilla";

export type chatterType = Pick<
  typeof contact.$inferSelect,
  "id" | "imageUrl" | "lastName" | "name" | "notes"
>;

export type ChatState = {
  chat: typeof chats.$inferSelect | null;
  contact: null | chatterType;
};

export type ChatActions = {
  setChat: (chatToBeAdded: typeof chats.$inferSelect | null) => void;
  updateContactFields: (updatedContact: Omit<chatterType, "id">) => void;
};

export type ChatStore = ChatState & ChatActions;

export const defaultInitState = {
  chat: null,
  chatInfo: {
    imageUrl: null,
    name: null,
  },
  contact: null,
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setChat: (chatToBeAdded) =>
      set((state) => ({ ...state, chat: chatToBeAdded })),
    updateContactFields: (updatedContact) =>
      set(
        produce((state: ChatState) => {
          if (!state.contact) return;

          Object.assign(state.contact, updatedContact);
        })
      ),
  }));
};

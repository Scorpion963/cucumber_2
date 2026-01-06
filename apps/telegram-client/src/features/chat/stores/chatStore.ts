import { ContactType } from "@/server/mappers/mapChatsToStore";
import { createStore } from "zustand/vanilla";

// TODO: add the type of the contact if the user finds a contact outside of their contacts

export type chatterType = {
  chatId: string | null;
  chatter: ContactType | null;
};

export type ChatState = {
  currentChatId: string | null;
  chatter: ContactType | null;
};

export type ChatActions = {
  // setChat: (chatToBeAdded: typeof chats.$inferSelect | null) => void;
  // updateContactFields: (updatedContact: Omit<chatterType, "id">) => void;
  setCurrentChatId: (chatId: string) => void;
  setCurrentUsername: (username: string) => void;
};

export type ChatStore = ChatState & ChatActions;

export const defaultInitState = {
  currentChatId: null,
  chatter: null
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setCurrentChatId: (chatId) => set((state) => ({...state, currentChatId: chatId})),
    setCurrentUsername: (username) => set(state => ({...state, currentUsername: username})),
    // setChat: (chatToBeAdded) =>
    //   set((state) => ({ ...state, chat: chatToBeAdded })),
    // updateContactFields: (updatedContact) =>
    //   set(
    //     produce((state: ChatState) => {
    //       if (!state.contact) return;

    //       Object.assign(state.contact, updatedContact);
    //     })
    //   ),
  }));
};

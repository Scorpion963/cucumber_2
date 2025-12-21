import { chats } from "db";
import { createStore } from "zustand/vanilla";

export type ChatState = {
  chat: typeof chats.$inferSelect | null;
};

export type ChatActions = {
  setChat: (chatToBeAdded: typeof chats.$inferSelect | null) => void;
};

export type ChatStore = ChatState & ChatActions;

export const defaultInitState = {
  chat: null,
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setChat: (chatToBeAdded) => set(() => ({ chat: chatToBeAdded })),
  }));
};

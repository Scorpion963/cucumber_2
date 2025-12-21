import { chats } from "db";
import { createStore } from "zustand/vanilla";

export type ChatState = {
  chat: typeof chats.$inferSelect | null;
  chatInfo: Pick<typeof chats.$inferSelect, "imageUrl" | "name"> | null;
};

export type ChatActions = {
  setChat: (chatToBeAdded: typeof chats.$inferSelect | null) => void;
  setChatInfo: (
    chatInfoToBeAdded: Pick<typeof chats.$inferSelect, "imageUrl" | "name"> | null
  ) => void;
};

export type ChatStore = ChatState & ChatActions;

export const defaultInitState = {
  chat: null,
  chatInfo: {
    imageUrl: null,
    name: null,
  },
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setChat: (chatToBeAdded) =>
      set((state) => ({ ...state, chat: chatToBeAdded })),
    setChatInfo: (chatInfo) => set((state) => ({ ...state, chatInfo })),
  }));
};

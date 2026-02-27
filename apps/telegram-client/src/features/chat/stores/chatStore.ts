import { createStore } from "zustand/vanilla";

type ChatState = {
  currentChatId: string | null,
  currentChatterId: string | null
}

export type ChatActions = {
  setCurrentChatId: (chatId: string) => void;
  setCurrentChatterId: (chatterId: string) => void
};

export type ChatStore = ChatState & ChatActions;

export const createChatStore = (initState: ChatState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setCurrentChatId: (chatId) => set((state) => ({...state, currentChatId: chatId})),
    setCurrentChatterId: (chatterId) => set(state => ({...state, currentChatterId: chatterId}))
  }));
};

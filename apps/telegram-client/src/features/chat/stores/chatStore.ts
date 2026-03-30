import { createStore } from "zustand/vanilla";

type ChatState = {
  currentChatId: string | null,
  currentChatterId: string | null
}

export type ChatActions = {
  setCurrentChatId: (chatId: string | null) => void;
  setCurrentChatterId: (chatterId: string | null) => void
};

export type ChatStore = ChatState & ChatActions;

export const createChatStore = (initState: ChatState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setCurrentChatId: (chatId) => set((state) => ({...state, currentChatId: chatId})),
    setCurrentChatterId: (chatterId) => set(state => ({...state, currentChatterId: chatterId}))
  }));
};

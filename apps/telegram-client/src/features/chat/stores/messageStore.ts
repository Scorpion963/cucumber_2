import { message } from "db";
import { createStore } from 'zustand/vanilla'

export type MessageState = {
  messages: (typeof message.$inferSelect)[];
};

export type MessageActions = {
  addMessage: (messageToAdd: typeof message.$inferSelect) => void;
  setMessages: (messagesToSet: (typeof message.$inferSelect)[]) => void;
};

export type MessageStore = MessageState & MessageActions;

export const defaultInitMessageState = {
  messages: [],
};

export const createMessageStore = (initState: MessageState = defaultInitMessageState) => {
    return createStore<MessageStore>()(set => ({
        ...initState,
        addMessage: (message) => set((prev) => ({messages: [...prev.messages, message]})),
        setMessages: (messages) => set(() => ({messages}))
    }))
};

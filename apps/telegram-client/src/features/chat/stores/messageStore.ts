import { MessageStatusType } from "@/providers/types/user-store-provider-types";
import { message } from "db";
import { createStore } from "zustand/vanilla";

export type MessageType = typeof message.$inferSelect & {
  status: MessageStatusType;
};

export type MessageState = {
  messages: MessageType[];
};

export type MessageActions = {
  addMessage: (messageToAdd: MessageType) => void;
  setMessages: (messagesToSet: MessageType[]) => void;
  updateMessageStatus: (message: Pick<MessageType, "status" | "id">) => void;
};

export type MessageStore = MessageState & MessageActions;

export const defaultInitMessageState = {
  messages: [],
};

export const createMessageStore = (
  initState: MessageState = defaultInitMessageState,
) => {
  return createStore<MessageStore>()((set) => ({
    ...initState,
    addMessage: (message) =>
      set((prev) => ({ messages: [...prev.messages, message] })),
    setMessages: (messages) => set(() => ({ messages })),
    updateMessageStatus: (message) =>
      set((prev) => {
        const exists = prev.messages.findIndex(
          (item) => item.id === message.id,
        );
        if (exists) {
          return {
            ...prev,
            messages: [
              ...prev.messages.slice(0, exists),
              { ...prev.messages[exists], message },
              ...prev.messages.slice(exists),
            ],
          };
        } else {
          return {
            ...prev,
          };
        }
      }),
  }));
};

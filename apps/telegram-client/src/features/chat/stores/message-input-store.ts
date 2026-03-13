import { message } from "db";
import { createStore } from "zustand/vanilla";
import {v4 as uuidv4} from 'uuid'

type RequiredInputValues = {
  chatId: string;
  text: string;
  senderId: string;
  id: string;
};

type OptionalInputValues = Omit<
  typeof message.$inferSelect,
  "chatId" | "senderId" | "text" | "id" | "createdAt" | "updatedAt"
>;

export type MessageInputType = RequiredInputValues & OptionalInputValues;

export type MessageInputState = {
  message: MessageInputType;
};

export type MessageInputActions = {
  updateInputMessage: (values: {
    text: string;
    replyToMessageId?: string | null;
  }) => void;

  resetInputMessage: () => void;
};

export type MessageInputStore = MessageInputState & MessageInputActions;

export const createMessageInputStore = (props: MessageInputState) => {
  return createStore<MessageInputStore>((set) => ({
    ...props,
    updateInputMessage: (values) =>
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          text: values.text,
          replyToMessageId: values.replyToMessageId ?? null,
        },
      })),

    resetInputMessage: () =>
      set((state) => ({
        ...state,
        message: {
          ...state.message,
          id: uuidv4(),
          forwardedFromMessageId: null,
          replyToMessageId: null,
          text: "",
        },
      })),
  }));
};

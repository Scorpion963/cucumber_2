import { ContactType, HomeChatsType } from "@/server/mappers/mapChatsToStore";
import { createStore } from "zustand/vanilla";

export type HomeChatsState = {
  chats: Map<string, HomeChatsType>
  contacts: Map<string, ContactType>
};

export type HomeChatsActions = {
    updateContactByUsername: (username: string, data: Partial<ContactType>) => void;
};

export type HomeChatsStore = HomeChatsState & HomeChatsActions;

export const defaultInitState: HomeChatsState = { 
  chats: new Map<string, HomeChatsType>(),
  contacts: new Map<string, ContactType>()
};

export const createHomeChatsStore = (
  initState: HomeChatsState = defaultInitState
) => {
  return createStore<HomeChatsStore>()((set) => ({
    ...initState,
    updateContactByUsername: (username, data) => {
      
    }
  }));
};

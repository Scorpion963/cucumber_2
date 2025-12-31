import { chats, contact, message, user } from "db";
import { createStore } from "zustand/vanilla";

type HomeChatsType = {
  
}

export type HomeChatsState = {
  chats: Map<string, HomeChatsType>
};

export type HomeChatsActions = {

};

export type HomeChatsStore = HomeChatsState & HomeChatsActions;

export const defaultInitState: HomeChatsState = { };

export const createHomeChatsStore = (
  initState: HomeChatsState = defaultInitState
) => {
  return createStore<HomeChatsStore>()((set) => ({
    ...initState,
  }));
};

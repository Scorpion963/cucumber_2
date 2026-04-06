import removeUndefined from "@/lib/removeUndefined";
import { HomeChatsLastMessageType, HomeChatsType, UserWithContactType } from "@/providers/types/user-store-provider-types";
import { ChatType, contact } from "db";
import { produce } from "immer";
import { createStore } from "zustand/vanilla";

export type HomeChatsState = {
  chats: Map<string, HomeChatsType>;
  users: Map<string, UserWithContactType>;
};

export type HomeChatsActions = {
  updateContactInfoById: (
    id: string,
    users: Partial<Pick<typeof contact.$inferSelect, | "id" | "imageUrl" | "lastName" | "notes" | "name">>
  ) => void;
  addUser: (contact: UserWithContactType) => void;
  addChat: (chat: HomeChatsType) => void;
  updateLastMessage: (chatId: string, chat: HomeChatsLastMessageType) => void
  replaceChat: (id: string, chat: HomeChatsType) => void,
  updateChat: (id: string,  chatValues: Partial<Omit<HomeChatsType, "type">>) => void
};

export type HomeChatsStore = HomeChatsState & HomeChatsActions;

export const defaultInitState: HomeChatsState = {
  chats: new Map<string, HomeChatsType>(),
  users: new Map<string, UserWithContactType>(),
};

export const createHomeChatsStore = (
  initState: HomeChatsState = defaultInitState
) => {
  console.log("RECREATED")
  return createStore<HomeChatsStore>()((set) => ({
    ...initState,
    updateContactInfoById: (id, user) => {
      set((state) => {
        const contactExists = state.users.get(id);
        if (!contactExists?.contactInfo) return { ...state };

        const cleanUser = removeUndefined(user)
        const newMap = new Map(state.users);

        newMap.set(id, {...contactExists, contactInfo: {...contactExists.contactInfo, ...cleanUser}});
        return { ...state, users: newMap };
      });
    },

    addChat: (chat) => set(state => {
      const chats = new Map(state.chats)
      chats.set(chat.id, chat)

      return {...state, chats}
    })
    ,

    replaceChat: (id, chat) => set(state => {
      const newMap = new Map(state.chats)

      newMap.delete(id)
      newMap.set(chat.id, chat)

      return {...state, chats: newMap}
    }),

    addUser: (contact) =>
      set((state) => {
        const users = new Map(state.users);
        users.set(contact.id, contact);

        return { ...state, users };
      }),
    
    updateLastMessage: (chatId, lastMessage) => {
      set(state => {
        const chatExists = state.chats.get(chatId)
        if(!chatExists) return {...state}

        const newMap = new Map(state.chats)
        newMap.set(chatId, {...chatExists, lastMessage: lastMessage ?? chatExists.lastMessage})
        return {...state, chats: newMap}
      })
    },

    updateChat: (chatId, chatValues) => {
      set(state => {
        const chatExists = state.chats.get(chatId)
        if(!chatExists) return state

        const {type: _ignored, ...rest} = removeUndefined(chatValues)
        const newMap = new Map(state.chats)

        newMap.set(chatId, {...chatExists, ...rest})
        return {...state, chats: newMap}
      })
    }
  }));
};

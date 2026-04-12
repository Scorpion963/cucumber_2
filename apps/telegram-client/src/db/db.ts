import { MessageType } from "@/features/chat/stores/messageStore"
import { HomeChatsType } from "@/providers/types/user-store-provider-types"
import { message } from "db"
import { Dexie, type EntityTable } from "dexie"


const idb = new Dexie("FriendsDatabase") as Dexie & {
  messages: EntityTable<
    MessageType,
    "id" 
  >,
  chats: EntityTable<HomeChatsType, "id">
}

idb.version(1).stores({
  messages: "id, chatId, senderId, status, createdAt, [chatId+createdAt]", 
  chats: "id, userId, status"
})

export { idb }

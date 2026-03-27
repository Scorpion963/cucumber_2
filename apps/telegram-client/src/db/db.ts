import { MessageType } from "@/features/chat/stores/messageStore"
import { message } from "db"
import { Dexie, type EntityTable } from "dexie"


const idb = new Dexie("FriendsDatabase") as Dexie & {
  messages: EntityTable<
    MessageType,
    "id" 
  >,
}

idb.version(1).stores({
  messages: "id, chatId, senderId, status, createdAt, [chatId+createdAt]", 
})

export { idb }

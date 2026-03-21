import { message } from "db"
import { Dexie, type EntityTable } from "dexie"

type MessageType = typeof message.$inferSelect

const idb = new Dexie("FriendsDatabase") as Dexie & {
  messages: EntityTable<
    MessageType,
    "id" 
  >,
}

idb.version(1).stores({
  messages: "id, chatId, senderId", 
})

export { idb }

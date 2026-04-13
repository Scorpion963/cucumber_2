"use client"

import { idb } from "@/db/db"
import { useChatStore } from "@/features/chat/providers/chatStoreProvider"
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent"
import { useHomeChatsStore } from "@/providers/user-store-provider"

export function useHandleChatroomDeleted(){
  const {removeChat} = useHomeChatsStore(state => state)
  const {currentChatId, currentChatterId} = useChatStore(state => state)

  async function chatDeletedHandler(data: {id: string, userId?: string}){
    console.log("event received")
    await idb.chats.delete(data.id)
    await idb.messages.delete(data.id)

    const isActiveChat = currentChatId === data.id || currentChatterId === data.userId 
    if(isActiveChat){
      removeChat(data.id) 
    }
  }

  useReceiveSocketEvent("CHATROOM_DELETED", chatDeletedHandler)
}

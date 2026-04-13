"use client"

import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent"
import { toast } from "sonner"

export function useHandleChatroomDeletedError(){
  async function handler(){
    toast.error("Chatroom deletion failed")
  } 

  useReceiveSocketEvent("CHAT_DELETION_FAILED", handler)
}
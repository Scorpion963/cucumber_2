"use client"

import { useHandleChatroomDeletedError } from "./useChatDeletionError"
import { useHandleChatCreated } from "./useHandleChatCreated"
import { useHandleChatCreationError } from "./useHandleChatCreationError"
import { useHandleChatroomDeleted } from "./useHandleChatroomDeleted"

export function useChatSocketEvents(){
    useHandleChatroomDeleted()
    useHandleChatroomDeletedError()

    useHandleChatCreated()
    useHandleChatCreationError()
}
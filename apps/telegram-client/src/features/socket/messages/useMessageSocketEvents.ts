"use client"

import { useHandleMessageCreated } from "./useHandleMessageCreated"
import { useHandleMessageAck } from "./useHandleMessagesAck"
import { useSocketMessageCreatedError } from "./useMessageCreatedError"

export function useMessageSocketEvents(){
    useHandleMessageCreated()
    useSocketMessageCreatedError()
    useHandleMessageAck()
}
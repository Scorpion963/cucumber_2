"use client"

import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";


export function useHandleMessageAck() {
  function handleAckMessageCreated() {
    return;
  }

  useReceiveSocketEvent("ACK_MESSAGE_CREATED", handleAckMessageCreated);
}
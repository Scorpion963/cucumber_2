"use client"

import { useSocketStore } from "@/providers/socket-store-provider";
import { SOCKET_EMITS, SOCKET_ERRORS, SOCKET_EVENTS } from "@/types/socket-events-types";
import { useEffect } from "react";

type EventTypes = keyof typeof SOCKET_EVENTS | keyof typeof SOCKET_EMITS | keyof typeof SOCKET_ERRORS

export default function useReceiveSocketEvent<T>(event: EventTypes, handler: (data: T) => Promise<void> | void) {
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) {
      // TODO: handle this error somehow
      console.log("Socket is null");
      return;
    }

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}
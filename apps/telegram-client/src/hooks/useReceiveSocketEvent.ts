"use client"

import { useSocketStore } from "@/providers/socket-store-provider";
import { useEffect } from "react";
import { ServerToClientErrors, ServerToClientEvents } from "types";

type EventTypes = keyof typeof ServerToClientErrors | keyof typeof ServerToClientEvents

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
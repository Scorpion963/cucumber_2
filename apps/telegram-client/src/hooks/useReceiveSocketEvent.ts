"use client"

import { useSocketStore } from "@/providers/socket-store-provider";
import { SOCKET_EVENTS } from "@/types/socket-events-types";
import { useEffect } from "react";

export default function useReceiveSocketEvent<T>(event: keyof typeof SOCKET_EVENTS, handler: (data: T) => void) {
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
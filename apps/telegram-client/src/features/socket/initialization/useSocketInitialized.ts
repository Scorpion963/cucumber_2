"use client"

import { idb } from "@/db/db";
import { useSocketStore } from "@/providers/socket-store-provider";
import { SOCKET_EMITS } from "@/types/socket-events-types";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";

export function useSocketInitialized() {
  const messages = useLiveQuery(async () =>
    idb.messages.where("status").equals("sending").toArray(),
  );
  const socket = useSocketStore((state) => state.socket);

  console.log("indexed db messages: ", messages);

  useEffect(() => {
    if (socket === null) return;
    if (!messages) return;

    messages.forEach((item) => {
      socket.emit(SOCKET_EMITS.SEND_TEXT_MESSAGE, item);
    });
  }, [socket]);

  return;
}
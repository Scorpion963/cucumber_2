"use client"

import { idb } from "@/db/db";
import { useSocketStore } from "@/providers/socket-store-provider";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { ClientToServerEvents } from "types";

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
      socket.emit(ClientToServerEvents.SEND_TEXT_MESSAGE, item);
    });
  }, [socket]);

  return;
}
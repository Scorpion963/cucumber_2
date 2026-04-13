"use client"

import { useHomeChatsStore } from "@/providers/user-store-provider";
import { useChatSocketEvents } from "./chats/useChatSocketEvents";
import { useSocketInitialized } from "./initialization/useSocketInitialized";
import { useMessageSocketEvents } from "./messages/useMessageSocketEvents";
import { useEffect } from "react";

export function SocketEventGlobalReceiver() {
  useSocketInitialized();

  useMessageSocketEvents()

  useChatSocketEvents()
  const chats = useHomeChatsStore((state) => state.chats);

  useEffect(() => {
    console.log("chats changed: ", chats);
  }, [chats]);

  return null;
}
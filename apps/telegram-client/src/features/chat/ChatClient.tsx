"use client";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import ChatInput from "./components/ChatInput";
import { useChatStore } from "./providers/chatStoreProvider";
import { useMessageStore } from "./providers/messageStoreProvider";
import EditContact from "./components/EditContact/EditContact";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { useEffect } from "react";

export default function ChatClient() {
  const { chatter } = useChatStore((state) => state);
  const { messages } = useMessageStore((state) => state);
  const { addContact } = useHomeChatsStore((state) => state);

  useEffect(() => {
    if (chatter?.userId) {
      addContact(chatter);
    }
  }, [addContact, chatter]);

  console.log("messages: ", messages);

  return (
    <div className="w-full h-full flex">
      <div className="h-full flex-1">
        <ChatHeader />
        <ChatContent />
        <ChatInput />
      </div>
      <EditContact />
    </div>
  );
}

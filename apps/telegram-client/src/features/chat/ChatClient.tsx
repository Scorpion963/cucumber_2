"use client";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import ChatInput from "./components/ChatInput";
import { useChatStore } from "./providers/chatStoreProvider";
import { useMessageStore } from "./providers/messageStoreProvider";
import EditContact from "./components/EditContact/EditContact";

export default function ChatClient() {
  const { chat } = useChatStore((state) => state);
  const { messages } = useMessageStore((state) => state);

  console.log("storeChat, ", chat);
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

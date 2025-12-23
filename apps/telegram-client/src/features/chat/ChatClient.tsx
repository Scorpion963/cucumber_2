"use client";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import ChatInput from "./components/ChatInput";
import { useChatStore } from "./providers/chatStoreProvider";
import { useMessageStore } from "./providers/messageStoreProvider";

export default function ChatClient() {
  const { chat } = useChatStore((state) => state);
  const { messages } = useMessageStore((state) => state);

  console.log("storeChat, ", chat);
  console.log("messages: ", messages);

  return (
    <div className="w-full h-full">
      <ChatHeader />
      <ChatContent />
      <ChatInput />
    </div>
  );
}

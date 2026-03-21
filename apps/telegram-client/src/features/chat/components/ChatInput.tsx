"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useMessageStore } from "../providers/messageStoreProvider";
import { ComponentProps } from "react";
import { useSocketStore } from "@/providers/socket-store-provider";
import { cn } from "@/lib/utils";
import { useMessageInputStore } from "../providers/messageInputStoreProvider";
import { useButtonShortcut } from "../hooks/useButtonShortcut";
import { useChatScrollArea } from "../providers/chatScrollAreaProvider";
import { ChatBodyWrapper } from "./ChatBodyWrapper";
import { SOCKET_EMITS } from "@/types/socket-events-types";
import { useHomeChatsStore } from "@/providers/user-store-provider";

export default function ChatInput() {
  const socket = useSocketStore((state) => state.socket);
  const { addMessage } = useMessageStore((state) => state);
  const { inputMessage, updateInputMessage, resetInputMessage } =
    useMessageInputStore((state) => state);
  const {scrollToBottom} = useChatScrollArea()
  const updateLastMessage = useHomeChatsStore(state => state.updateLastMessage)

  useButtonShortcut("Enter", handleSendMessage);

  function handleSendMessage() {
    if (inputMessage.text.trim().length < 1 || !socket) return;

    addMessage({
      ...inputMessage,
      text: inputMessage.text,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "sending"
    });
    updateLastMessage(inputMessage.chatId, {id: inputMessage.id, text: inputMessage.text, updatedAt: new Date(), status: "sending"})
    socket.emit(SOCKET_EMITS.SEND_TEXT_MESSAGE, inputMessage);
    resetInputMessage();
    scrollToBottom()
  }

  return (
    <ChatBodyWrapper>
      <div className="w-full h-full pt-2 flex gap-2">
        <Input
          value={inputMessage.text}
          onChange={(e) => updateInputMessage({ text: e.target.value })}
          className="rounded-full"
        />
        <SendButton disabled={!socket} onClick={() => handleSendMessage()} />
      </div>
    </ChatBodyWrapper>
  );
}

export function SendButton({ ...props }: ComponentProps<"button">) {
  return (
    <Button
      {...props}
      className={cn(
        "rounded-full cursor-pointer disabled:cursor-default",
        props.className,
      )}
      variant={"outline"}
    >
      <Send />
    </Button>
  );
}

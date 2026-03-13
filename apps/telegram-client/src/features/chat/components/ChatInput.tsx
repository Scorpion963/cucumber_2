"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ChatBodyWrapper } from "../ChatClient";
import { useMessageStore } from "../providers/messageStoreProvider";
import { ComponentProps, useState } from "react";
import { useSocketStore } from "@/providers/socket-store-provider";
import { cn } from "@/lib/utils";
import { useMessageInputStore } from "../providers/messageInputStoreProvider";
import { SOCKET_EMITS } from "./ChatContent";

export default function ChatInput() {
  const { messages, addMessage } = useMessageStore((state) => state);
  const socket = useSocketStore((state) => state.socket);
  const { message, updateInputMessage, resetInputMessage } =
    useMessageInputStore((state) => state);

  function handleSendMessage() {
    if (message.text.trim().length < 1 || !socket) return;

    addMessage({
      ...message,
      text: message.text,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    socket.emit(SOCKET_EMITS.SEND_TEXT_MESSAGE, message);
    resetInputMessage();
  }

  return (
    <ChatBodyWrapper>
      <div className="w-full h-full pt-2 flex gap-2">
        <Input
          value={message.text}
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

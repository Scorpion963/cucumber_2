"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useMessageStore } from "../providers/messageStoreProvider";
import { ComponentProps } from "react";
import { useSocketStore } from "@/providers/socket-store-provider";
import { cn } from "@/lib/utils";
import { useMessageInputStore } from "../providers/messageInputStoreProvider";
import { SOCKET_EMITS } from "./ChatContent";
import { useButtonShortcut } from "../hooks/useButtonShortcut";
import { authClient } from "@/lib/auth-client";
import { useChatScrollArea } from "../providers/chatScrollAreaProvider";
import { ChatBodyWrapper } from "./ChatBodyWrapper";

export default function ChatInput() {
  const socket = useSocketStore((state) => state.socket);
  const { messages, addMessage } = useMessageStore((state) => state);
  const { inputMessage, updateInputMessage, resetInputMessage } =
    useMessageInputStore((state) => state);
  const {scrollToBottom} = useChatScrollArea()

  useButtonShortcut("Enter", handleSendMessage);

  function handleSendMessage() {
    if (inputMessage.text.trim().length < 1 || !socket) return;

    addMessage({
      ...inputMessage,
      text: inputMessage.text,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
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

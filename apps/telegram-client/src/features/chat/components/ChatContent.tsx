import { ScrollArea } from "@/components/ui/scroll-area";
import ChatScrollArea from "./ChatScrollArea";
import { ChatBodyWrapper } from "../ChatClient";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocketStore } from "@/providers/socket-store-provider";
import { useEffect } from "react";
import { useMessageStore } from "../providers/messageStoreProvider";
import { message } from "db";

function useReceiveSocketEvent(event: string, handler: () => void) {
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

export enum SOCKET_EMITS {
  SEND_TEXT_MESSAGE = "send_text_message",
}
export enum SOCKET_EVENTS {
  MESSAGE_CREATED = "message_created",
}

export default function ChatContent() {
  const { messages, addMessage, setMessages } = useMessageStore((state) => state);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;

    function handleMessageCreated(data: typeof message.$inferSelect) {
      const updatedMessages = messages.filter(item => item.id !== data.id)
      console.log("updated", data , messages)
      console.log("updated messages: ", updatedMessages)
      setMessages([...updatedMessages, {...data, createdAt: new Date(data.createdAt), updatedAt: new Date(data.updatedAt)}])
    }

    socket.on(SOCKET_EVENTS.MESSAGE_CREATED, (data) =>
      handleMessageCreated(data),
    );

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_CREATED);
    };
  }, [socket, messages]);

  return (
    <ChatScrollArea className="h-full">
      <ChatBodyWrapper className="h-full flex flex-col justify-end gap-4">
        {messages.map((item) => (
          <Message
            content={item.text!}
            date={item.createdAt.toLocaleTimeString("en-US", {hour: "numeric", minute: '2-digit', hour12: true})}
            isOwned={false}
            isRead={false}
            key={item.id}
          />
        ))}
      </ChatBodyWrapper>
    </ChatScrollArea>
  );
}

function Message({
  content,
  date,
  isRead,
  isOwned,
}: {
  content: string;
  date: string;
  isRead: boolean;
  isOwned: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl max-w-[66%] w-fit py-1 px-3 bg-secondary flex items-center",
        isOwned && "self-end",
      )}
    >
      <span className="break-all">{content}</span>
      <span className="text-muted-foreground text-xs self-end flex items-end gap-1">
        {date}{" "}
        <span className="flex relative">
          <Check size={12} className="absolute left-1" />{" "}
          <Check className="" size={12} />
        </span>
      </span>
    </div>
  );
}

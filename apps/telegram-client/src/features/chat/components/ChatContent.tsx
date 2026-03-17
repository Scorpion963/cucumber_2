import { useMessageStore } from "../providers/messageStoreProvider";
import { message } from "db";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { ChatBodyWrapper } from "./ChatBodyWrapper";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import Message from "./Message";
import formatMesesageTime from "@/lib/formaters/formatMessageTime";
import { useHomeChatsStore } from "@/providers/user-store-provider";

export default function ChatContent() {
  const { messages, setMessages } = useMessageStore(
    (state) => state,
  );
  const updateLastMessage = useHomeChatsStore(state => state.updateLastMessage)
  const { currentUser } = useCurrentUserStore((state) => state);

  useReceiveSocketEvent("MESSAGE_CREATED", handleMessageCreated);

  function handleMessageCreated(data: typeof message.$inferSelect) {
    const updatedMessages = messages.filter((item) => item.id !== data.id);
    console.log("updated", data, messages);
    console.log("updated messages: ", updatedMessages);
    setMessages([
      ...updatedMessages,
      {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
    ]);

    updateLastMessage(data.chatId, data)
  }

  return (
    <>
      {messages.map((item, index) => (
        <div
          className={`w-full h-full ${item.id === currentUser.id ? "mt-1" : "mt-2"} ${index === messages.length - 1 && "mb-1"}`}
          key={item.id}
        >
          <ChatBodyWrapper>
            <Message
              content={item.text!}
              date={formatMesesageTime(item.updatedAt)}
              isOwned={currentUser.id === item.senderId}
              isRead={false}
            />
          </ChatBodyWrapper>
        </div>
      ))}
    </>
  );
}


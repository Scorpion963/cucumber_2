import { useMessageStore } from "../providers/messageStoreProvider";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { ChatBodyWrapper } from "./ChatBodyWrapper";
import Message from "./Message";
import formatMesesageTime from "@/lib/formaters/formatMessageTime";

export default function ChatContent() {
  const { messages, setMessages } = useMessageStore(
    (state) => state,
  );
  const { currentUser } = useCurrentUserStore((state) => state);

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
              date={formatMesesageTime(new Date(item.updatedAt))}
              isOwned={currentUser.id === item.senderId}
              isRead={false}
              status={item.status}
            />
          </ChatBodyWrapper>
        </div>
      ))}
    </>
  );
}


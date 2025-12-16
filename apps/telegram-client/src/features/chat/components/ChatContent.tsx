import { ScrollArea } from "@/components/ui/scroll-area";
import ChatScrollArea from "./ChatScrollArea";

export default function ChatContent() {

  return (
    <ChatScrollArea>
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
    </ChatScrollArea>
  );
}

function Message() {
  return <div className="w-12 h-12 rounded-lg bg-gray-600">hello</div>;
}

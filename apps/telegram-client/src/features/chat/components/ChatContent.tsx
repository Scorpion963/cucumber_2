import { ScrollArea } from "@/components/ui/scroll-area";
import ChatScrollArea from "./ChatScrollArea";
import { ChatBodyWrapper } from "../ChatClient";
import { Check } from "lucide-react";

export default function ChatContent() {
  return (
    <ChatScrollArea className="h-full p-2">
      <ChatBodyWrapper className="h-full flex flex-col justify-end">
        <Message
          content="this is a message from someone idk who though fjoiweajfaejfiowajjfawoifjawiofjiawoejfoaweifjawiofjioaewjfwadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddiofjeiwaojfawfiowajfioawjfiawojfiawojfiawo"
          date="12:32"
          isRead={false}
        />
      </ChatBodyWrapper>
    </ChatScrollArea>
  );
}

function Message({
  content,
  date,
  isRead,
}: {
  content: string;
  date: string;
  isRead: boolean;
}) {
  return (
    <div className="rounded-xl max-w-[66%] w-fit py-1 px-3 bg-secondary flex items-center">
      <span className="lg:break-all">{content}</span>
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

"use client";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import ChatInput from "./components/ChatInput";
import { useChatStore } from "./providers/chatStoreProvider";
import { useMessageStore } from "./providers/messageStoreProvider";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { useEffect } from "react";
import SidebarRouter from "@/components/SidebarRouter/SidebarRouter";
import { privateSidebarRoutesMap } from "./components/EllipsisMenuManager";

//  the use of useChatStore and useHomeChatsStore feels a little weird
// because the useChatStore almost plays almost the same role as the useHomechatsStore but for single user
// that has been found, i feel like since the state is local
// there is not need in creating a new store just for a single user
// i could just just pass this user down the props and add it the homeChatsStore
// and in case i need to display info i could creete hooks that would return just the data

export default function ChatClient() {
  const { chatter } = useChatStore((state) => state);
  const { messages } = useMessageStore((state) => state);
  const { addUser } = useHomeChatsStore((state) => state);

  useEffect(() => {
    if (chatter?.userId) {
      addUser(chatter);
    }
  }, [addUser, chatter]);

  console.log("messages: ", messages);

  return (
    <div className="w-full h-full flex">
      <div className="h-full flex-1">
        <ChatHeader />
        <ChatContent />
        <ChatInput />
      </div>
      <div>
        <SidebarRouter animate={false} routesMap={privateSidebarRoutesMap} />
      </div>
    </div>
  );
}

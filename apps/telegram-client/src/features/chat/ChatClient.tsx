"use client";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import ChatInput from "./components/ChatInput";
import { useMessageStore } from "./providers/messageStoreProvider";
import SidebarRouter from "@/components/SidebarRouter/SidebarRouter";
import { privateSidebarRoutesMap } from "./components/EllipsisMenuManager";
import useMediaQuery from "./hooks/useMediaQuery";
import { useEffect } from "react";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import ChatScrollArea from "./components/ChatScrollArea";

//  the use of useChatStore and useHomeChatsStore feels a little weird
// because the useChatStore almost plays almost the same role as the useHomechatsStore but for single user
// that has been found, i feel like since the state is local
// there is not need in creating a new store just for a single user
// i could just just pass this user down the props and add it the homeChatsStore
// and in case i need to display info i could creete hooks that would return just the data

export default function ChatClient() {
  const { clear } = useSidebarRouterStore((state) => state);
  const { matches, prev } = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (matches && matches !== prev) clear();
  }, [matches, prev, clear]);

  return (
    <div className="w-full h-full flex">
      <div className="h-full flex-1">
        <ChatHeader />
        <ChatScrollArea>
          <ChatContent />
        </ChatScrollArea>
      </div>

      {/* <div className="h-full flex-1">  
        <ChatHeader />
        <div className="h-[calc(100%-56px-56px)] flex flex-col justify-end">
          <div className="overflow-y-auto h-fit max-h-full w-full">
            <Messages />
            <Messages />
            <Messages />
            <Messages />
            <Messages />
            <Messages />
          </div>
        </div>
        <ChatInput />
      </div> */}

      <div>
        <SidebarRouter animate={false} routesMap={privateSidebarRoutesMap} />
      </div>
    </div>
  );
}

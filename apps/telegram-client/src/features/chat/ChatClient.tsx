"use client";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import ChatInput from "./components/ChatInput";
import { useMessageStore } from "./providers/messageStoreProvider";
import SidebarRouter from "@/components/SidebarRouter/SidebarRouter";
import { privateSidebarRoutesMap } from "./components/EllipsisMenuManager";
import useMediaQuery from "./hooks/useMediaQuery";
import { ReactNode, useEffect } from "react";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { useSocketStore } from "@/providers/socket-store-provider";
import { cn } from "@/lib/utils";

//  the use of useChatStore and useHomeChatsStore feels a little weird
// because the useChatStore almost plays almost the same role as the useHomechatsStore but for single user
// that has been found, i feel like since the state is local
// there is not need in creating a new store just for a single user
// i could just just pass this user down the props and add it the homeChatsStore
// and in case i need to display info i could creete hooks that would return just the data

export default function ChatClient() {
  const { messages } = useMessageStore((state) => state);
  const { clear } = useSidebarRouterStore((state) => state);
  console.log("messages: ", messages);

  const { matches, prev } = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (matches && matches !== prev) clear();
  }, [matches, prev, clear]);

  const socket = useSocketStore((state) => state.socket);

  console.log("socket in chat: ", socket);

  return (
    <div className="w-full h-full flex">
      <div className="h-full flex-1">
        <ChatHeader />
        <div className="h-full w-full flex flex-col">
          <ChatContent />
          <ChatInput />
        </div>
      </div>
      <div>
        <SidebarRouter animate={false} routesMap={privateSidebarRoutesMap} />
      </div>
    </div>
  );
}

export function ChatBodyWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("lg:w-2/3 lg:mx-auto", className)}>{children}</div>;
}

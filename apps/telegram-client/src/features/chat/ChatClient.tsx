"use client";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import SidebarRouter from "@/components/SidebarRouter/SidebarRouter";
import { privateSidebarRoutesMap } from "./components/EllipsisMenuManager";
import useMediaQuery from "./hooks/useMediaQuery";
import { useEffect, useState } from "react";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import ChatScrollArea from "./components/ChatScrollArea";
import { useMessageStore } from "./providers/messageStoreProvider";
import { MessageType } from "./stores/messageStore";
import { useLiveQuery } from "dexie-react-hooks";
import { idb } from "@/db/db";
import {
  useChatStore,
  useHandleAddUserAndChats,
} from "./providers/chatStoreProvider";
import Dexie from "dexie";
import {
  HomeChatsType,
  UserWithContactType,
} from "@/providers/types/user-store-provider-types";
import { usePathname } from "next/navigation";

//  the use of useChatStore and useHomeChatsStore feels a little weird
// because the useChatStore almost plays almost the same role as the useHomechatsStore but for single user
// that has been found, i feel like since the state is local
// there is not need in creating a new store just for a single user
// i could just just pass this user down the props and add it the homeChatsStore
// and in case i need to display info i could creete hooks that would return just the data

export default function ChatClient({
  messages,
  currentChatterId,
  currentChatId,
  chatExists,
  chat,
  chatter,
}: {
  messages: MessageType[];
  currentChatterId: string | null;
  chat: HomeChatsType | null;
  currentChatId: string | null;
  chatter: UserWithContactType | null;
}) {
  const { clear } = useSidebarRouterStore((state) => state);
  const { matches, prev } = useMediaQuery("(max-width: 1024px)");
  const setMessages = useMessageStore((state) => state.setMessages);
  const renderMessages = useMessageStore((state) => state.messages);
  const chatId = useChatStore((state) => state.currentChatId);
  // const { setCurrentChatId, setCurrentChatterId } = useChatStore(
  //   (state) => state,
  // );

  console.log("chatId", chatId)

  useHandleAddUserAndChats({ chat: chat, chatter: chatter });
  const pathname = usePathname();

  useEffect(() => {
    setMessages([]);
  }, [pathname, setMessages]);
 
  // useEffect(() => {
  //   setCurrentChatId(chat?.id ?? null);
  //   setCurrentChatterId(chatter?.id ?? null);
  // }, [chat?.id, chatter?.id, setCurrentChatId, setCurrentChatterId]);

  useEffect(() => {
    idb.messages.bulkPut(messages);
  }, [messages, setMessages]);

  useEffect(() => {
    async function fetchLocalMessages() {
      if (!chatId) return;
      console.log("runs here: ", chatId)

      const localMessages = await idb.messages
        .where("[chatId+createdAt]")
        .between([chatId, Dexie.minKey], [chatId, Dexie.maxKey])
        .toArray();
      setMessages(localMessages);
      console.log("local messages chatId: ", chatId);
      console.log("local messages: ", localMessages);
    }
    fetchLocalMessages();
  }, [messages, chatId, setMessages, pathname]);

  useEffect(() => {
    if (matches && matches !== prev) clear();
  }, [matches, prev, clear]);

  return (
    <div className="w-full h-full flex">
      <div className="h-full flex-1">
        <ChatHeader />
        <ChatScrollArea scrollBottomCondition={renderMessages.length !== 0}>
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

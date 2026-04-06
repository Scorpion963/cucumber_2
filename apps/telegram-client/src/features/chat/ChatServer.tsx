"use server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import handleChatFetch from "./server/getChatBasedOnPrefix";
import getMessagesDB from "./server/db/getMessagesDB";
import { ChatStoreProvider } from "./providers/chatStoreProvider";
import { headers } from "next/headers";
import ChatClient from "./ChatClient";
import { SidebarRouterProvider } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { MessageInputStoreProvider } from "./providers/messageInputStoreProvider";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "./stores/messageStore";

export async function ChatServer({ paramsId }: { paramsId: string }) {
  const user = await auth.api.getSession({ headers: await headers() });
  const chat = await handleChatFetch(paramsId, user!.user.id);

  console.log(chat);

  if (!chat.canAccess) redirect("/");
  if (!chat.chat && !chat.chatter) redirect("/");

  const messages: MessageType[] = chat.chat?.id
    ? (await getMessagesDB(chat.chat.id)).map((item) => ({
        ...item,
        status: "sent",
      }))
    : [];

  return (
    <SidebarRouterProvider>
      {/* <ChatStoreProvider
        currentChatterId={chat.chatter?.id ?? null}
        currentChatId={chat.chat?.id ?? null}
        chat={chat.chat}
        chatter={chat.chatter}
      > */}
      {/* <MessageStoreProvider value={messages}> */}
      <MessageInputStoreProvider
        message={{
          id: uuidv4(),
          senderId: user!.user.id,
          text: "",
          forwardedFromMessageId: null,
          replyToMessageId: null,
        }}
      >
        <ChatClient
          currentChatterId={chat.chatter?.id ?? null}
          currentChatId={chat.chat?.id ?? null}
          chat={chat.chat}
          chatter={chat.chatter}
          messages={messages}
        />
      </MessageInputStoreProvider>
      {/* </MessageStoreProvider> */}
      {/* </ChatStoreProvider> */}
    </SidebarRouterProvider>
  );
}

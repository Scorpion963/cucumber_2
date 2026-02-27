"use server";
import { auth } from "@/lib/auth";
import { message } from "db";
import { redirect } from "next/navigation";
import handleChatFetch from "./server/getChatBasedOnPrefix";
import getMessagesDB from "./server/db/getMessagesDB";
import { ChatStoreProvider } from "./providers/chatStoreProvider";
import { MessageStoreProvider } from "./providers/messageStoreProvider";
import { headers } from "next/headers";
import ChatClient from "./ChatClient";
import { SidebarRouterProvider } from "@/components/SidebarRouter/providers/sidebar-routes-provider";

export async function ChatServer({ paramsId }: { paramsId: string }) {
  const user = await auth.api.getSession({ headers: await headers() });
  const chat = await handleChatFetch(paramsId, user!.user.id);

  console.log(chat)

  if (!chat.canAccess) redirect("/");
  if(!chat.chat && !chat.chatter) redirect("/")
  
  const messages: (typeof message.$inferSelect)[] = chat.chat?.id
    ? await getMessagesDB(chat.chat.id)
    : [];

    console.log("Fetched current chat: ", chat)

  return (
    <SidebarRouterProvider>
      <ChatStoreProvider
        currentChatterId={chat.chatter?.id ?? null}
        currentChatId={chat.chat?.id ?? null}
        chat={chat.chat}
        chatter={chat.chatter}
      >
        <MessageStoreProvider value={messages}>
          <ChatClient />
        </MessageStoreProvider>
      </ChatStoreProvider>
    </SidebarRouterProvider>
  );
}

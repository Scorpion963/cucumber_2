"use server"
import { auth } from "@/lib/auth";
import { message } from "db";
import { redirect } from "next/navigation";
import handleChatFetch from "./server/getChatBasedOnPrefix";
import getMessagesDB from "./server/db/getMessagesDB";
import { ChatStoreProvider } from "./providers/chatStoreProvider";
import { MessageStoreProvider } from "./providers/messageStoreProvider";
import { headers } from "next/headers";
import ChatClient from "./ChatClient";

export async function ChatServer({ paramsId }: { paramsId: string }) {
  const user = await auth.api.getSession({ headers: await headers() });
  const chat = await handleChatFetch(paramsId, user!.user.id);

  if (!chat.canAccess) redirect("/");

  const messages: (typeof message.$inferSelect)[] = chat.chat
    ? await getMessagesDB(chat.chat.id)
    : [];


  return (
    <ChatStoreProvider contact={chat.contact} chat={chat.chat}>
      <MessageStoreProvider value={messages}>
        <ChatClient />
      </MessageStoreProvider>
    </ChatStoreProvider>
  );
}

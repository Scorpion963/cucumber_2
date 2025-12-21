import Chat from "@/features/chat/Chat";
import { ChatStoreProvider } from "@/features/chat/providers/chatStoreProvider";
import { MessageStoreProvider } from "@/features/chat/providers/messageStoreProvider";
import handleChatFetch from "@/features/chat/server/getChatBasedOnPrefix";
import { auth } from "@/lib/auth";
import { db, message } from "db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = decodeURIComponent((await params).id);
  const user = await auth.api.getSession({ headers: await headers() });
  const chat = await handleChatFetch(id, user!.user.id);

  if (!chat.canAccess) redirect("/");

  const messages: (typeof message.$inferSelect)[] = chat.chat
    ? await db.query.message.findMany({
        where: eq(message.id, chat.chat.id),
      })
    : [];

  return (
    <ChatStoreProvider value={chat.chat}>
      <MessageStoreProvider value={messages}>
        <Chat />
      </MessageStoreProvider>
    </ChatStoreProvider>
  );
}

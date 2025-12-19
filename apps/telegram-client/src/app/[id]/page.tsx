import Chat from "@/features/chat/Chat";
import { auth } from "@/lib/auth";
import { chatMember, chats, db } from "db";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// TODO: use usernames instead of ids

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const isGroupChat = id[0] === "-";
  const user = await auth.api.getSession({ headers: await headers() });
  
  let chatInfo;

  if (isGroupChat) {
    const groupChatId = id.slice(1)
    const [chat] = await getGroupChat(groupChatId, user!.user.id);
    if(!chat) redirect("/")
    else chatInfo = chat
  }

  return <Chat />;
}

async function getGroupChat(chatId: string, userId: string) {
  return db
    .select()
    .from(chatMember)
    .innerJoin(chats, eq(chats.id, chatMember.chatId))
    .where(
      and(
        eq(chatMember.userId, userId),
        eq(chats.id, chatId),
        eq(chats.type, "group")
      )
    );
}

async function getSingleChat(userId: string, secondUserId: string) {
  return db.select().from(chats);
}

import Chat from "@/features/chat/Chat";
import handleChatFetch from "@/features/chat/server/getChatBasedOnPrefix";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// TODO: use usernames instead of ids

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = decodeURIComponent((await params).id);
  const user = await auth.api.getSession({ headers: await headers() });
  const chat = await handleChatFetch(id, user!.user.id);

  if (!chat.canAccess) redirect("/");

  return <Chat />;
}

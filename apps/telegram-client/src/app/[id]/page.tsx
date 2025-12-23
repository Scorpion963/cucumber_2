import { ChatServer } from "@/features/chat/ChatServer";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = decodeURIComponent((await params).id);

  return (
    <ChatServer paramsId={id} />
  );
}

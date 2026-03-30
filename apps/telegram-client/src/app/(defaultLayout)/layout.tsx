import ResizablePanels from "@/components/ResizablePanels/ResizablePanels";
import Sidebar from "@/features/sidebar/Sidebar";
import { auth } from "@/lib/auth";
import { CurrentUserStoreProvider } from "@/providers/current-user-store-provider";
import { HomeChatsProvider } from "@/providers/user-store-provider";
import findHomeChatsForStore from "@/server/db/findHomeChatsForStore";
import { mapChatsToStore } from "@/server/mappers/mapChatsToStore";
import { user } from "db";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { SocketEventGlobalReceiver } from "./page";
import { MessageStoreProvider } from "@/features/chat/providers/messageStoreProvider";
import { ChatStoreProvider } from "@/features/chat/providers/chatStoreProvider";

// TODO: Sidebar doesn't disappear when in mobile

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return;
  console.log(session.user.id);

  console.log("LAYOUT_CHANGED");
  const homeChats = await findHomeChatsForStore(session.user.id);

  console.log("HOMECHATS: ", homeChats);

  const { mappedUsers, mappedChatInfo } = mapChatsToStore(homeChats);
  console.log("mapped: ", mappedChatInfo, mappedUsers);

  // I can't match the types that are in drizzle and better auth, they are slightly out of sync, because the unprovided types
  // in drizzle are null by default, but better auth doesn't know that, so it assigns them possible undefined which breaks the ts
  const currentUser = session.user as typeof user.$inferSelect;

  return (
    <div>
      <CurrentUserStoreProvider currentUser={currentUser}>
        <HomeChatsProvider chats={mappedChatInfo} users={mappedUsers}>
          <ChatStoreProvider>
            <MessageStoreProvider>
              <div className="w-full h-screen">
                <ResizablePanels sidebar={<Sidebar />}>
                  {children}
                </ResizablePanels>
              </div>
              <SocketEventGlobalReceiver />
            </MessageStoreProvider>
          </ChatStoreProvider>
        </HomeChatsProvider>
      </CurrentUserStoreProvider>
    </div>
  );
}

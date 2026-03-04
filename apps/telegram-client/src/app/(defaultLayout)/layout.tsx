import ResizablePanels from "@/components/ResizablePanels/ResizablePanels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "@/features/sidebar/Sidebar";
import { auth } from "@/lib/auth";
import { HomeChatsProvider } from "@/providers/user-store-provider";
import findHomeChatsForStore from "@/server/db/findHomeChatsForStore";
import { mapChatsToStore } from "@/server/mappers/mapChatsToStore";
import { headers } from "next/headers";
import { ReactNode } from "react";

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
  return (
    <div>
      <HomeChatsProvider chats={mappedChatInfo} users={mappedUsers}>
        <div className="w-full h-screen">
          <ResizablePanels sidebar={<Sidebar />}>
            {children}
          </ResizablePanels>
        </div>
      </HomeChatsProvider>
    </div>
  );
}


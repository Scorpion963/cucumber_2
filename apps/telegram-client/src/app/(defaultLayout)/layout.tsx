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
          <div className=" w-full h-full">
            <ResizablePanelGroup
              direction="horizontal"
              className="rounded-lg border w-full "
            >
              <ResizablePanel minSize={15} maxSize={30} defaultSize={20}>
                <Sidebar />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel className="hidden lg:block" defaultSize={80}>
                {children}
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </HomeChatsProvider>
    </div>
  );
}

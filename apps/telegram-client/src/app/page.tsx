import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Chat from "@/features/chat/Chat";
import Sidebar from "@/features/sidebar/Sidebar";
import { authClient } from "@/lib/auth-client";
import { db } from "db";
import { io } from "socket.io-client";

export default async function Home() {
  return (
    <div className="w-full h-screen ">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px]  rounded-lg border w-full"
      >
        <ResizablePanel minSize={15} maxSize={30} defaultSize={20}>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <Chat />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}


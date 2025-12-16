import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "@/features/sidebar/components/Sidebar";
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
        <ResizablePanel minSize={10} maxSize={30} defaultSize={20}>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <div></div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}


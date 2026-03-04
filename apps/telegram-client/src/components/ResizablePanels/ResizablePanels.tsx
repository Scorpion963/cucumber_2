"use client";

import { usePathname } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ReactNode } from "react";

type ResizablePanelsProps = {
  children: ReactNode;
  sidebar: ReactNode;
};

export default function ResizablePanels({
  children,
  sidebar,
}: ResizablePanelsProps) {
  const pathname = usePathname();
  const isRoot = pathname === "/"

  const sidebarClassname = isRoot ? "block" : "hidden lg:block"
  const contentClassname = !isRoot ? "block" : "hidden lg:block"

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border w-full"
    >
      <ResizablePanel className={sidebarClassname} minSize={15} maxSize={30} defaultSize={20}>
        {sidebar}
      </ResizablePanel>
      <ResizableHandle className={sidebarClassname} />
      <ResizablePanel className={contentClassname} defaultSize={80}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

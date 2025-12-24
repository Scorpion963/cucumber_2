"use client";

import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";

export default function CustomizeUserSidebar() {
  const { pop } = useSidebarRouterStore((state) => state);
  return (
    <div>
      <Button onClick={() => pop()}>back</Button>
    </div>
  );
}

"use client";

import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import CustomizeUserForm from "./CustomizeUserForm";

export default function CustomizeUserSidebar() {
  const { pop } = useSidebarRouterStore((state) => state);
  return (
    <div>
      <Button onClick={() => pop()}>back</Button>
      <CustomizeUserForm defaultFields={{bio: "", firstName: "", lastName: "", username: ""}} />
    </div>
  );
}

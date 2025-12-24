"use client";

import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import CustomizeUserForm from "./CustomizeUserForm";
import SidebarHeader from "../SidebarHeader";

export default function CustomizeUserSidebar() {
  const { pop } = useSidebarRouterStore((state) => state);
  return (
    <div className="pr-2">
      <SidebarHeader title="Edit profile" />
      <CustomizeUserForm defaultFields={{bio: "", firstName: "", lastName: "", username: ""}} />
    </div>
  );
}

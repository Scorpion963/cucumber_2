"use client";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import { Edit, EllipsisVertical } from "lucide-react";
import SidebarHeader from "../SidebarHeader";

export function Settings() {
  const { pop, push } = useSidebarRouterStore((state) => state);
  return (
    <SidebarHeader title="Settings">
      <div>
        <Button
          onClick={() => push("/customize-user")}
          className="rounded-full cursor-pointer"
          variant={"ghost"}
        >
          <Edit className="size-6" />
        </Button>
        <Button className="rounded-full cursor-pointer" variant={"ghost"}>
          <EllipsisVertical className="size-6" />
        </Button>
      </div>
    </SidebarHeader>
  );
}


"use client";
import SidebarBackHeader from "@/components/SidebarRouter/components/SidebarBackHeader";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import { Edit, EllipsisVertical } from "lucide-react";

export function Settings() {
  const push = useSidebarRouterStore((state) => state.push);

  return (
    <>
      <SidebarBackHeader title="Settings">
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
      </SidebarBackHeader>
    </>
  );
}

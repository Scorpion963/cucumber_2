"use client";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, EllipsisVertical } from "lucide-react";

export function Settings() {
  const { pop, push } = useSidebarRouterStore((state) => state);
  return (
    <div className="flex items-center gap-2 py-2">
      <Button
        onClick={() => pop()}
        className="rounded-full cursor-pointer"
        variant={"ghost"}
      >
        <ArrowLeft className="size-6" />
      </Button>

      <div className=" flex-1">Settings</div>
      <div>
        {" "}
        <Button onClick={() => push("/customize-user")} className="rounded-full cursor-pointer" variant={"ghost"}>
          <Edit className="size-6" />
        </Button>
        <Button className="rounded-full cursor-pointer" variant={"ghost"}>
          <EllipsisVertical className="size-6" />
        </Button>
      </div>
    </div>
  );
}

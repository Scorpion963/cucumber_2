"use client";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Edit, EllipsisVertical } from "lucide-react";
import { ReactNode } from "react";

export default function SidebarHeader({ children, title, className }: { children?: ReactNode, title: string, className?: string }) {
  const { pop } = useSidebarRouterStore((state) => state);

  return (
    <div className={cn("flex items-center gap-2 py-2", className)}>
      <Button
        onClick={() => pop()}
        className="rounded-full cursor-pointer"
        variant={"ghost"}
      >
        <ArrowLeft className="size-6" />
      </Button>

      <div className=" flex-1">{title}</div>
      <div>{children}</div>
    </div>
  );
}

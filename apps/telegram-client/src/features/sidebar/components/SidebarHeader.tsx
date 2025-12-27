"use client";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Edit, EllipsisVertical } from "lucide-react";
import { ReactNode } from "react";
import BaseSidebarHeader from "@/components/Sidebar/SidebarHeader";

export default function SidebarHeader({ children, title, className }: { children?: ReactNode, title: string, className?: string }) {
  const { pop } = useSidebarRouterStore((state) => state);

  return (
    <BaseSidebarHeader title={title} onClick={() => pop()}>
    {children}
    </BaseSidebarHeader>
  );
}

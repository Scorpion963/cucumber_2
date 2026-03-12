import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import { useSidebarRouterStore } from "../providers/sidebar-routes-provider";
import { ReactNode } from "react";

export default function SidebarBackHeader({
  children,
  title,
  className,
}: {
  children?: ReactNode;
  title: string;
  className?: string;
}) {
  const pop = useSidebarRouterStore((state) => state.pop);

  return (
    <SidebarHeader title={title} onClick={() => pop()} className={className}>
      {children}
    </SidebarHeader>
  );
}

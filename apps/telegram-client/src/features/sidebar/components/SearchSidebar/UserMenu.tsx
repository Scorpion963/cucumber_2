"use client"
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";

export default function UserMenu() {
  const {push} = useSidebarRouterStore(state => state)
  return (
    <Popover>
      <PopoverTrigger>
        <Menu />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={16}
        className="w-56 flex flex-col p-0"
      >
        <Button onClick={() => push("/user-profile")} className="rounded-t-lg rounded-b-none cursor-pointer">Hello</Button>
        <Button className="rounded-none cursor-pointer">Hello</Button>
        <Button className="rounded-none cursor-pointer">Hello</Button>
        <Button className="rounded-none cursor-pointer">Hello</Button>
        <Button className="rounded-none cursor-pointer">Hello</Button>
        <Button className="rounded-none cursor-pointer">Hello</Button>
        <Button className="rounded-b-lg rounded-t-none cursor-pointer">Hello</Button>
      </PopoverContent>
    </Popover>
  );
}

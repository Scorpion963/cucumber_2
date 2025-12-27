"use client";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu, UserIcon } from "lucide-react";
import { useState } from "react";


export default function UserMenu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { push } = useSidebarRouterStore((state) => state);
  return (
    <Popover onOpenChange={(e) => setIsModalOpen(e)} open={isModalOpen}>
      <PopoverTrigger>
        <Menu />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={16}
        className="w-56 flex flex-col p-0"
      >
        <Button
          onClick={() => {setIsModalOpen(false);push("/user-profile")}}
          variant={"ghost"}
          className="rounded-t-lg rounded-lg cursor-pointer justify-start"
        >
          <span>
            <UserIcon />
          </span>
          <span> My Profile</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

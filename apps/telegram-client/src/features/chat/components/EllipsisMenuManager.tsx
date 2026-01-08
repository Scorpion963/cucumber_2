"use client";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChatType } from "db";
import { Edit } from "lucide-react";
import { ReactNode, useState } from "react";
import EditContact from "./EditContact/EditContact";

// TODO: organize everything into separate files

const privateSidebarRoutes = ["/edit"] as const;
type PrivateSidebarRoutesType = (typeof privateSidebarRoutes)[number];
type S<T extends string> = {
  [K in T]: ReactNode;
};
export const privateSidebarRoutesMap: S<PrivateSidebarRoutesType> = {
  "/edit": <EditContact />,
};

export default function ellipsisMenuManager(type: ChatType) {
  switch (type) {
    case "group":
      return <GroupChatMenu />;
    case "private":
      return <PrivateChatMenu />;
    default:
      return null;
  }
}

export function PopoverWrapper({
  icon,
  type,
}: {
  icon: ReactNode;
  type: ChatType;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(type);

  return (
    <Popover onOpenChange={(e) => setIsModalOpen(e)} open={isModalOpen}>
      <PopoverTrigger>{icon}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={24}
        className="w-56 flex flex-col p-0"
        onClick={() => setIsModalOpen(false)}
      >
        {ellipsisMenuManager(type)}
      </PopoverContent>
    </Popover>
  );
}

function PopoverButton({
  icon,
  text,
  ...props
}: React.ComponentProps<"button"> & { icon: ReactNode; text: string }) {
  return (
    <Button
      variant={"ghost"}
      className="rounded-t-lg rounded-lg cursor-pointer justify-start"
      {...props}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </Button>
  );
}

function GroupChatMenu() {
  return <></>;
}

function PrivateChatMenu() {
  const {replace} = useSidebarRouterStore(state => state)
    return (
    <>
      <PopoverButton
        icon={<Edit />}
        text="Edit"
        onClick={() => replace("/edit")}
      />
    </>
  );
}

"use client";

import { FaUserAlt } from "react-icons/fa";
import useChatInfo from "../hooks/useChatInfo";
import { PopoverWrapper } from "./EllipsisMenuManager";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatHeader() {
  const { chat, chatter, chatImageUrl, chatName } = useChatInfo();

  if (!chatter && !chat) return null;
  
  console.log("Chat Header: ", chat)

  return (
    <div className="w-full flex py-1 border-b items-center px-2">
      <div className="w-full flex gap-2   items-center">
        <BackButton />


        <Avatar className="size-9">
          <AvatarImage src={chatImageUrl ?? undefined} alt="" className="" />
          <AvatarFallback>
            <FaUserAlt size={24} />
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="text-ellipsis">{chatName ?? "Chatter"}</div>
          <div className="text-sm text-muted-foreground text-ellipsis">
            last seen 39 minutes ago
          </div>
        </div>
      </div>
      <div>
        <PopoverWrapper
          icon={<EllipsisVertical />}
          type={chatter ? "private" : chat!.type}
        />
      </div>
    </div>
  );
}

export function BackButton() {
  return (
    <Link href={"/"}>
      <Button
        className="rounded-full cursor-pointer lg:hidden"
        variant={"ghost"}
      >
        <ArrowLeft />
      </Button>
    </Link>
  );
}

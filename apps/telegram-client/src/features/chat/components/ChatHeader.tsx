"use client";

import Image from "next/image";
import { FaUserAlt } from "react-icons/fa";
import useChatInfo from "../hooks/useChatInfo";
import { PopoverWrapper } from "./EllipsisMenuManager";
import { EllipsisVertical } from "lucide-react";

export default function ChatHeader() {
  const { chatImageUrl, chatName, chat, chatter } = useChatInfo();
  if (!chatter && !chat) return null;
  return (
    <div className="w-full flex  py-1 border-b items-center px-4">
      <div className="w-full flex gap-2   items-center">
        <div className="size-9 rounded-full bg-card flex items-center justify-center relative overflow-hidden">
          {chatImageUrl ? (
            <Image
              src={chatImageUrl}
              fill
              style={{ objectFit: "cover" }}
              alt={`${chatName}\' photo`}
            />
          ) : (
            <FaUserAlt size={24} />
          )}
        </div>

        <div className="">
          <div className="text-ellipsis">{chatName ?? "Chatter"}</div>
          <div className="text-sm text-muted-foreground text-ellipsis">
            last seen 39 minutes ago
          </div>
        </div>
      </div>
      <div>
        {(chatter !== null || chat !== null) && (
          <PopoverWrapper
            icon={<EllipsisVertical />}
            type={chatter ? "private" : chat!.type}
          />
        )}
      </div>
    </div>
  );
}

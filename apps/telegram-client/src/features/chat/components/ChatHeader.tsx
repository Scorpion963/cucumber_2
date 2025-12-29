"use client";

import Image from "next/image";
import { FaUserAlt } from "react-icons/fa";
import useChatInfo from "../hooks/useChatInfo";

export default function ChatHeader() {
  const {chatImageUrl, chatName} = useChatInfo()
  return (
    <div className="w-full flex gap-2 px-4  items-center py-1 border-b">
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
  );
}

"use client";

import Image from "next/image";
import { useChatStore } from "../providers/chatStoreProvider";
import { FaUserAlt } from "react-icons/fa";

export default function ChatHeader() {
  const { chatInfo } = useChatStore((state) => state);
  return (
    <div className="w-full flex gap-2 px-4  items-center py-1 border-b">
      <div className="size-9 rounded-full bg-card flex items-center justify-center relative overflow-hidden">
        {chatInfo?.imageUrl ? <Image src={chatInfo.imageUrl} fill style={{objectFit: 'cover'}} alt={`${chatInfo.name}\' photo`} /> : <FaUserAlt size={24} />}
      </div>
      <div className="">
        <div className="text-ellipsis">{chatInfo?.name ?? "Chatter"}</div>
        <div className="text-sm text-muted-foreground text-ellipsis">
          last seen 39 minutes ago
        </div>
      </div>
    </div>
  );
}

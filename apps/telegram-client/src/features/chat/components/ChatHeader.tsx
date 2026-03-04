"use client";

import Image from "next/image";
import { FaUserAlt } from "react-icons/fa";
import useChatInfo from "../hooks/useChatInfo";
import { PopoverWrapper } from "./EllipsisMenuManager";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ChatHeader() {
  const { chat, chatter, chatImageUrl, chatName } = useChatInfo();

  if (!chatter && !chat) return null;

  return (
    <div className="w-full flex py-1 border-b items-center px-2">
      <div className="w-full flex gap-2   items-center">
        <BackButton />
        <Avatar alt={chatName} url={chatImageUrl} />

        <div>
          <div className="text-ellipsis">{chatName ?? "Chatter"}</div>
          <div className="text-sm text-muted-foreground text-ellipsis">
            last seen 39 minutes ago
          </div>
        </div>
      </div>
      <div>
        {(chatter || chat) && (
          <PopoverWrapper
            icon={<EllipsisVertical />}
            type={chatter ? "private" : chat!.type}
          />
        )}
      </div>
    </div>
  );
}

function Avatar({
  url,
  alt,
  className,
}: {
  url?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "size-9 rounded-full bg-card flex items-center justify-center relative overflow-hidden",
        className,
      )}
    >
      {url ? (
        <Image
          src={url}
          fill
          style={{ objectFit: "cover" }}
          alt={`${alt}\'s photo`}
        />
      ) : (
        <FaUserAlt size={24} />
      )}
    </div>
  );
}

function BackButton() {
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

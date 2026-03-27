import DisplayMessageStatus from "@/components/message/DisplayMessageStatus";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageStatusType } from "@/providers/types/user-store-provider-types";
import { RotateCcw } from "lucide-react";

export default function Message({
  content,
  date,
  isOwned,
  status,
}: {
  content: string;
  date: string;
  isOwned: boolean;
  status: MessageStatusType;
}) {
  return (
    <div
      className={cn(
        "flex w-full justify-start items-center gap-2",
        isOwned && "justify-end",
      )}
    >
      {status === "error" && (
        <div className="h-full">
          <Button variant={"ghost"} className="rounded-full cursor-pointer">
            <RotateCcw size={16} />
          </Button>
        </div>
      )}
      <div
        className={cn(
          `max-w-[66%] ${isOwned ? "bg-secondary" : "bg-secondary/50"} w-fit pb-1.5 px-2 rounded-lg pt-1.25`,
        )}
      >
        <div className="w-fit break-all flow-root" draggable={false}>
          {content}

          <span className="float-right text-xs py-1 relative flex gap-1 items-end top-1.25 ml-4 select-none right-1">
            <span>{date}</span>
            <DisplayMessageStatus status={status} />
          </span>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Message({
  content,
  date,
  isOwned,
  isRead,
}: {
  content: string;
  date: string;
  isRead: boolean;
  isOwned: boolean;
}) {
  return (
    <div className={cn("flex w-full justify-start", isOwned && "justify-end")}>
      <div className={`max-w-[66%] ${isOwned ? "bg-secondary" : "bg-secondary/50"} w-fit pb-1.5 px-2 rounded-lg pt-1.25`}>
        <div className="w-fit break-all flow-root">
          {content}

          <span className="float-right text-xs py-1 relative flex gap-1 items-end top-1.25 ml-4  right-1">
            <span>{date}</span>
            <div className="relative">
              <Check size={12} className="absolute left-1" />
              <Check size={12} />
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}

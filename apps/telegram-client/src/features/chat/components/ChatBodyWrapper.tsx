import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function ChatBodyWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("lg:w-2/3 lg:mx-auto", className)}>{children}</div>;
}
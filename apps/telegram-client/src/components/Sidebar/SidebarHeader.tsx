"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function SidebarHeader({
  className,
  onClick,
  title,
  children,
}: {
  children?: ReactNode;
  title: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2 py-2", className)}>
      <Button
        onClick={onClick}
        className="rounded-full cursor-pointer"
        variant={"ghost"}
      >
        <ArrowLeft className="size-6" />
      </Button>

      <div className=" flex-1">{title}</div>
      <div>{children}</div>
    </div>
  );
}

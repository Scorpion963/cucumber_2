"use client";
import { useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export default function Search({ ...props }: React.ComponentProps<"input">) {
  const ref = useRef<null | HTMLInputElement>(null);

  return (
    <div className="flex w-full relative items-center justify-between py-2">
      <IoIosSearch
        onClick={() => ref.current?.focus()}
        size={20}
        className="absolute left-3"
      />
      <Input
        ref={ref}
        className={cn("rounded-full pl-10", props.className)}
        {...props}
      />
    </div>
  );
}

"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import useIntersection from "../hooks/useIntersection";
import { cn } from "@/lib/utils";

export default function ChatScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const scrollAreaRef = useRef<null | HTMLDivElement>(null);
  const isIntersecting = useIntersection({
    observeRef: ref,
    rootRef: scrollAreaRef,
  });
  // const [height, setHeight] = useState<number>();
  // useEffect(() => {
  //   if (!scrollAreaRef.current) return;

  //   setHeight(scrollAreaRef.current.clientHeight);
  // }, []);

  // console.log("Height: ", height)

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className={cn(
        `h-full max-h-[calc(100%-53px-53px)] w-full overflow-hidden border-b  ${
          isIntersecting && "border-b-transparent"
        } transition-all duration-500 `,
        className,
      )}
    >
      <div className={`h-full`}>{children}</div>
      <div ref={ref} className="w-full h-px"></div>
    </ScrollArea>
  );
}

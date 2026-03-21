"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  createContext,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useIntersection from "../hooks/useIntersection";
import { cn } from "@/lib/utils";
import { ChatScrollAreaProvider } from "../providers/chatScrollAreaProvider";
import ChatInput from "./ChatInput";

export default function ChatScrollArea({
  children,
  className,
  scrollBottomCondition = true
}: {
  children: React.ReactNode;
  className?: string;
  scrollBottomCondition?: boolean
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const scrollAreaRef = useRef<null | HTMLDivElement>(null);
  const isIntersecting = useIntersection({
    observeRef: ref,
    rootRef: scrollAreaRef,
  });
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [isReady, setIsReady] = useState(false)

  useLayoutEffect(() => {
    if(!ref.current) return

    ref.current?.scrollIntoView({behavior: "smooth"})
    setScrollToBottom(false)
  }, [scrollToBottom])

  useLayoutEffect(() => {
    if(!ref.current || !scrollBottomCondition) return

    ref.current.scrollIntoView({behavior: "instant", block: "end"})
    setIsReady(true)
  }, [scrollBottomCondition])

  return (
    <ChatScrollAreaProvider scrollToBottom={() => setScrollToBottom(true)}>
      <ScrollArea
        ref={scrollAreaRef}
        className={cn(
          `h-full max-h-[calc(100%-53px-53px)] w-full overflow-hidden border-b  ${
            isIntersecting && "border-b-transparent"
          } transition-all duration-500 `,
          className,
        )}
      >
        <div className={`h-full ${isReady ? "visible" : "invisible"}`}>{children}</div>
        <div ref={ref} className="w-full h-px"></div>
      </ScrollArea>
      {/* <div ref={scrollAreaRef} className="overflow-y-auto h-full max-h-[calc(100%-53px-53px)] w-full overflow-hidden border-b">
        <div className={cn("invisible", isReady && "visible")}>{children}</div>
        <div ref={ref} className="w-full h-px"></div>
      </div> */}
      <ChatInput />
    </ChatScrollAreaProvider>
  );
}

// const [height, setHeight] = useState<number>();
// useEffect(() => {
//   if (!scrollAreaRef.current) return;

//   setHeight(scrollAreaRef.current.clientHeight);
// }, []);

// console.log("Height: ", height)

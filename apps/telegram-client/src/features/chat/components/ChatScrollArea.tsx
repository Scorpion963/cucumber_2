"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";

export default function ChatScrollArea({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<null | HTMLDivElement>(null);
  const scrollAreaRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollAreaRef.current || !ref.current) return;
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          console.log("intersecting");
        } else {
          setIsIntersecting(false);
          console.log("not intersecting");
        }
      });
    };
    const observer = new IntersectionObserver(
      (entries) => handleIntersection(entries),
      { root: scrollAreaRef.current, threshold: 1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className={`h-full max-h-[calc(100%-53px-53px)] w-full overflow-hidden border-b  ${
        isIntersecting && "border-b-transparent"
      } transition-all duration-500 `}
    >
      {children}
      <div ref={ref} className="w-full h-px"></div>
    </ScrollArea>
  );
}

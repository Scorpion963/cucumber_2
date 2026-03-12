"use client"
import { RefObject, useEffect, useState } from "react";

export default function useIntersection<T extends Element, U extends Element>({
  rootRef,
  observeRef,
}: {
  rootRef: RefObject<T | null>;
  observeRef: RefObject<U | null>;
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!rootRef.current || !observeRef.current) return;
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          console.log("intersecting in the hook useIntersection");
        } else {
          setIsIntersecting(false);
          console.log("not intersecting in the hook useIntersection");
        }
      });
    };
    const observer = new IntersectionObserver(
      (entries) => handleIntersection(entries),
      { root: rootRef.current, threshold: 1 },
    );
    observer.observe(observeRef.current);
    return () => observer.disconnect();
  }, [observeRef, rootRef]);

  return isIntersecting;
}

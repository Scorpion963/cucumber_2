"use client";

import { useEffect, useState } from "react";

export default function useMediaQuery(mediaQuery: string) {
  const [matches, setMatches] = useState<boolean>(false);
  const [prev, setPrev] = useState<boolean>();

  useEffect(() => {
    const media = window.matchMedia(mediaQuery);

    setMatches((prev) => {
      setPrev(prev);
      return media.matches;
    });

    const listener = (e: MediaQueryListEvent) => {
      setMatches((prev) => {
        setPrev(prev);
        return e.matches;
      });
    };

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [mediaQuery]);

  return { matches, prev };
}

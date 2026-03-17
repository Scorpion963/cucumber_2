"use client"

import { useEffect } from "react";

export function useButtonShortcut(targetKey: string, handler: () => void) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const listener = (e: KeyboardEvent) => {
      if (e.key === targetKey) handler();
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [targetKey, handler]);
}
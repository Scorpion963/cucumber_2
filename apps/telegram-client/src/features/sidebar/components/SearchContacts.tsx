"use client";

import Search from "@/components/Search";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useEffect, useState } from "react";

export default function SearchContacts() {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebouncedValue(value, 300);

  useEffect(() => {
    console.log(debouncedValue);
    console.log("sending the request");
    if (debouncedValue.trim().length === 0) return;
    const controller = new AbortController();
    
    async function fetchChats(controller: AbortController) {
      try {
        const res = await fetch(
          `/api/chats?query=${encodeURIComponent(debouncedValue)}`,
          { signal: controller.signal }
        );
        
        if (!res.ok) {
          throw new Error("Response status: " + res.status);
        }

        const data = await res.json();
        console.log(data)
      } catch {
        console.log("Error happened");
      }
    }

    fetchChats(controller);

    return () => controller.abort();
  }, [debouncedValue]);

  return <Search value={value} onChange={(e) => setValue(e.target.value)} />;
}

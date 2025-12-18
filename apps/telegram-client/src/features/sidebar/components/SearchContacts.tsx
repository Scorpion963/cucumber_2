"use client";

import Search from "@/components/Search";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useUserStore } from "@/providers/user-store-provider";
import { useEffect, useState } from "react";

export default function SearchContacts() {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebouncedValue(value, 300);
  const {setUsers} = useUserStore(state => state)

  useEffect(() => {
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

        const data = await res.json() ;
        setUsers(data.data)
      } catch {
        console.log("Error happened");
      }
    }

    fetchChats(controller);

    return () => controller.abort();
  }, [debouncedValue, setUsers]);

  return <Search value={value} onChange={(e) => setValue(e.target.value)} />;
}

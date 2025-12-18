"use client";

import Search from "@/components/Search";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useEffect, useState } from "react";
import { useSearchStore } from "../providers/search-store-provider";

// TODO: handle errors

export default function SearchContacts() {
  const { setUsers, setErrorMessage, searchValue, setSearchValue } = useSearchStore((state) => state);
  const debouncedValue = useDebouncedValue(searchValue, 300);

  useEffect(() => {
    if (debouncedValue.trim().length === 0) return;
    const controller = new AbortController();

    setErrorMessage(null);

    async function fetchChats(controller: AbortController) {
      try {
        const res = await fetch(
          `/api/chats?query=${encodeURIComponent(debouncedValue)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          const error = await res.json();
          const message = error.message ?? `Error: ${res.status}`;
          setErrorMessage(message);
          throw new Error("Response status: " + res.status);
        }

        const data = await res.json();
        setUsers(data.data);
      } catch {
        console.log("Error Happened");
      }
    }

    fetchChats(controller);

    return () => controller.abort();
  }, [debouncedValue, setUsers, setErrorMessage]);

  return <Search value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />;
}

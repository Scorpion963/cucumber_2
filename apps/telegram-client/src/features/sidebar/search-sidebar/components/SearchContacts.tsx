"use client";

import Search from "@/components/Search";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useEffect } from "react";
import { useSearchStore } from "../providers/search-store-provider";
import { ResponseType } from "@/types/response-types";
import { UserFoundType } from "../stores/search-store";
import { ReasonPhrases } from "http-status-codes";

// TODO: handle errors

export default function SearchContacts() {
  const { setUsers, setErrorMessage, searchValue, setSearchValue, resetError } =
    useSearchStore((state) => state);
  const debouncedValue = useDebouncedValue(searchValue, 300);

  useEffect(() => {
    if (debouncedValue.trim().length === 0) return;
    const controller = new AbortController();

    resetError()

    async function fetchChats(controller: AbortController) {
      try {
        const res = await fetch(
          `/api/chats?query=${encodeURIComponent(debouncedValue)}`,
          { signal: controller.signal }
        );
        const raw = await res.json()

        const json: ResponseType<UserFoundType[]> = raw
        if(!json.success){
          setErrorMessage(json.error.message, json.error.code)
          return
        }

        setUsers(json.data)
      } catch (error) {
        console.log("Error Happened: ", error);
        setErrorMessage("An unexpected error happened, please try again later", ReasonPhrases.INTERNAL_SERVER_ERROR)
      }
    }

    fetchChats(controller);

    return () => controller.abort();
  }, [debouncedValue, setUsers, setErrorMessage, resetError]);

  return (
    <Search
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  );
}

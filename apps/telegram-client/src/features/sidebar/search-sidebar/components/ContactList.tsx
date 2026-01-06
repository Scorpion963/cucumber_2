"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Contact from "./Contact";
import { useSearchStore } from "../providers/search-store-provider";
import useHomeChatsArray from "@/hooks/useHomeChatsArray";

// TODO: memoize chats and contacts

export default function ContactList() {
  const { usersFound, searchValue } = useSearchStore((state) => state);
  const chats = useHomeChatsArray();

  if (usersFound.length === 0 && searchValue.trim().length !== 0)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>User not found</p>
      </div>
    );

  return (
    <ScrollArea className="h-full w-full">
      {usersFound.length === 0 ? (
        <>
          {chats.map((v) => (
            <Contact
              imageUrl={v.imageUrl}
              id={v.type === "private" ? v.username : v.id}
              name={v.name}
              key={v.id}
            />
          ))}
        </>
      ) : (
        usersFound.map((user) => (
          <Contact
            imageUrl={user.image}
            id={user.username}
            key={user.id}
            name={user.name}
          />
        ))
      )}
    </ScrollArea>
  );
}

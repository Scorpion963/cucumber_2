"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Contact from "./Contact";
import { useSearchStore } from "../providers/search-store-provider";

export default function ContactList() {
  const { usersFound, searchValue } = useSearchStore((state) => state);

  if (usersFound.length === 0 && searchValue.trim().length !== 0)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>User not found</p>
      </div>
    );

  return (
    <ScrollArea className="h-full w-full overflow-hidden">
      {usersFound.map((user) => (
        <Contact imageUrl={user.image} id={user.username} key={user.id} name={user.name}></Contact>
      ))}
    </ScrollArea>
  );
}

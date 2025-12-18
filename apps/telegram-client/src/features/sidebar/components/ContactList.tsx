"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/providers/user-store-provider";
import Contact from "./Contact";

export default function ContactList() {
  const { users } = useUserStore((state) => state);

  console.log("Users: ", users);

  return (
    <ScrollArea className="h-full w-full overflow-hidden">
      {users.map((user) => (
        <Contact key={user.id} name={user.name}></Contact>
      ))}
    </ScrollArea>
  );
}

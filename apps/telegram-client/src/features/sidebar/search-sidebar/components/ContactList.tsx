"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Contact from "./Contact";
import { useSearchStore } from "../providers/search-store-provider";
import useHomeChatsArray from "@/hooks/useHomeChatsArray";
import { getPublicAssetUrl } from "@/services/s3/lib/helpers";
import {
  ContextMenuPopup,
  ContextMenuTrigger,
  PopupContent,
} from "@/components/ContextMenuPopup/ContextMenuPopup";
import { Button } from "@/components/ui/button";

// TODO: memoize chats and contacts

export default function ContactList() {
  const { usersFound, searchValue, error } = useSearchStore((state) => state);
  const chats = useHomeChatsArray();

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>{error.message}</p>
      </div>
    );
  }

  if (usersFound.length === 0 && searchValue.trim().length !== 0)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>User not found</p>
      </div>
    );

  return (
    <ScrollArea className="h-full w-full">
      {searchValue.trim().length === 0 ? (
        <HomeChatsSidebarContent />
      ) : (
        usersFound.map((user) => (
          <>
            <Contact
              lastMessage={null}
              imageUrl={getPublicAssetUrl(user.image, user.imageProvider)}
              id={user.id}
              key={user.id}
              name={user.name}
            />
          </>
        ))
      )}
    </ScrollArea>
  );
}

function HomeChatsSidebarContent() {
  const chats = useHomeChatsArray();

  return (
    <ContextMenuPopup>
      {chats.map((item) => (
        <ContextMenuTrigger key={item.id} id={item.id}>
          <Contact
            id={item.id}
            imageUrl={item.imageUrl}
            lastMessage={item.lastMessage}
            name={item.chatName}
          />
        </ContextMenuTrigger>
      ))}
      <PopupContent>
        <Button>hello</Button>
      </PopupContent>
    </ContextMenuPopup>
  );
}

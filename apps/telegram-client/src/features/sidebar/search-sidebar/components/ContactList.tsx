"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Contact from "./Contact";
import { useSearchStore } from "../providers/search-store-provider";
import useHomeChatsArray from "@/hooks/useHomeChatsArray";
import { getPublicAssetUrl } from "@/services/s3/lib/helpers";
import useReceiveSocketEvent from "@/hooks/useReceiveSocketEvent";
import { message } from "db";
import { useHomeChatsStore } from "@/providers/user-store-provider";

// TODO: memoize chats and contacts

export default function ContactList() {
  const { usersFound, searchValue, error } = useSearchStore((state) => state);
  const updateLastMessage = useHomeChatsStore(
    (state) => state.updateLastMessage,
  );
  const chats = useHomeChatsArray();

  useReceiveSocketEvent("MESSAGE_CREATED", handleMessageCreated);

  function handleMessageCreated(data: typeof message.$inferSelect) {
    updateLastMessage(data.chatId, data);
  }

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
        <>
          {chats.map((v) => (
            <Contact
              lastMessage={v.lastMessage}
              imageUrl={v.imageUrl}
              id={v.id}
              name={v.chatName}
              key={v.id}
            />
          ))}
        </>
      ) : (
        usersFound.map((user) => (
          <Contact
            lastMessage={null}
            imageUrl={getPublicAssetUrl(user.image, user.imageProvider)}
            id={user.id}
            key={user.id}
            name={user.name}
          />
        ))
      )}
    </ScrollArea>
  );
}

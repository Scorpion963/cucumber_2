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
  useContextMenuPopup,
} from "@/components/ContextMenuPopup/ContextMenuPopup";
import { Button } from "@/components/ui/button";
import { useSocketStore } from "@/providers/socket-store-provider";
import { ClientToServerEvents } from "types";

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

function HomeChatsSidebarContent() {
  const chats = useHomeChatsArray();

  return (
    <ContextMenuPopup>
      {chats.map((item) => (
        <ContextMenuTrigger key={item.urlId} id={item.chatId}>
          <Contact
            id={item.urlId}
            imageUrl={item.imageUrl}
            lastMessage={item.lastMessage}
            name={item.chatName}
          />
        </ContextMenuTrigger>
      ))}
      <PopupContent>
        <SidebarPopupButtons />
      </PopupContent>
    </ContextMenuPopup>
  );
}

function SidebarPopupButtons() {
  const {selectedItem} = useContextMenuPopup()
  const socket = useSocketStore(state => state.socket)

  function handleDeleteChat(){
    if(!socket) return

    socket.emit(ClientToServerEvents.DELETE_CHATROOM, {id: selectedItem})
  }

  return (
    <>
      <Button variant={"default"} onClick={handleDeleteChat}>
        Delete
      </Button>
    </>
  );
}

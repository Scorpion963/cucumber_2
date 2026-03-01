"use client";

import { useHomeChatsStore } from "@/providers/user-store-provider";
import { useChatStore } from "../providers/chatStoreProvider";
import {
  HomeChatsType,
  UserWithContactType,
} from "@/providers/types/user-store-provider-types";
import { ImageProviderTypes } from "db";
import useS3Image from "./useS3Image";
import { getChatName } from "@/hooks/useHomeChatsArray";

type useChatInfoReturnType = {
  chat: null | HomeChatsType;
  chatter: null | UserWithContactType;
  chatImageUrl: string | null;
  chatName: string;
};

type ImageProps = {
  image: string | null;
  imageProvider: ImageProviderTypes;
  isPublic: boolean;
};

export default function useChatInfo(): useChatInfoReturnType {
  const { currentChatId, currentChatterId } = useChatStore((state) => state);
  const currentChat = useHomeChatsStore(state => currentChatId ? state.chats.get(currentChatId) : null)
  const currentChatter = useHomeChatsStore(state => currentChatterId ? state.users.get(currentChatterId) : null)

  console.log("CurrentChatId: ", currentChatterId)
  console.log("Current Chatter: ", currentChatter)

  const {chatName, image, imageProvider, isPublic} = handleChatNameAndImage(currentChat, currentChatter)

  const url = useS3Image({
    imageProvider: imageProvider,
    isPublic: isPublic,
    url: image,
  });

  return {
    chat: currentChat ?? null,
    chatter: currentChatter ?? null,
    chatImageUrl: url,
    chatName: chatName
  };
}

function handleChatNameAndImage(
  currentChat: HomeChatsType | null | undefined,
  currentChatter: UserWithContactType | null | undefined,
): ImageProps & { chatName: string } {
  if (currentChat && currentChat.type === "group") {
    return {
      image: currentChat.imageUrl,
      imageProvider: "aws",
      isPublic: false,
      chatName: currentChat.name,
    };
  } else if (currentChatter) {
    const image: ImageProps = currentChatter.contactInfo?.imageUrl
      ? {
          image: currentChatter.contactInfo.imageUrl,
          isPublic: false,
          imageProvider: "aws",
        }
      : {
          image: currentChatter.image,
          isPublic: true,
          imageProvider: currentChatter.imageProvider as ImageProviderTypes,
        };

    return { ...image, chatName: getChatName(currentChatter) };
  }

  //TODO: figure out how to do it if there currentChatter and currentChat is null
  return {
    image: null,
    imageProvider: "aws",
    isPublic: true,
    chatName: "Default chat name (Error happened)",
  };
}
"use client";

import { getImageUrlS3 } from "@/actions/getSignedUrl";
import {
  HomeChatsType,
  UserWithContactType,
} from "@/providers/types/user-store-provider-types";
import { useHomeChatsStore } from "@/providers/user-store-provider";
import { getPublicAssetUrl } from "@/services/s3/lib/helpers";
import { ImageProviderTypes } from "db";
import { useEffect, useMemo, useState } from "react";

export default function useHomeChatsArray() {
  const chats = useHomeChatsStore((state) => state.chats);
  const users = useHomeChatsStore((state) => state.users);
  const arrayChats = useMemo(
    () =>
      Array.from(chats.values()).map((item) => {
        return getRelevantChat(item, users);
      }),
    [chats, users],
  );
  const [sidebarChats, setSidebarChats] = useState<DisplayChats[]>([]);

  useEffect(() => {
    async function handleImageUrls() {
      const fetchedImages = await Promise.all(
        arrayChats.map(async (item) => {
          try {
            const imageUrl = item.isImagePublic
              ? getPublicAssetUrl(item.imageUrl, item.imageProvider)
              : item.imageUrl && (await getImageUrlS3(item.imageUrl));
            return { ...item, imageUrl };
          } catch {
            console.log("Avatar fetch in sidebar failed");
            return { ...item, imageUrl: null };
          }
        }),
      );

      setSidebarChats(fetchedImages);
    }

    handleImageUrls();
  }, [arrayChats]);

  return sidebarChats;
}

type DisplayChats = {
  id: string;
  imageUrl: string | null;
  chatName: string | null;
  isImagePublic: boolean;
  imageProvider: ImageProviderTypes;
};

export function getRelevantChat(
  chat: HomeChatsType,
  users: Map<string, UserWithContactType>,
): DisplayChats {
  if (chat.type === "private") {
    const userId = chat.userId;
    // If user exists it shouldn't be null, but what if it is though
    // TODO: I feel like I need to add a fallback fetch, so that in case it is null or undefined i fetch
    // and add it to the users, but it should never happen though
    const user = users.get(userId ?? "");
    if (!user)
      return {
        chatName: null,
        id: chat.id,
        imageUrl: null,
        isImagePublic: false,
        imageProvider: "aws",
      };

    const image: Pick<
      DisplayChats,
      "imageUrl" | "imageProvider" | "isImagePublic"
    > = user.contactInfo?.imageUrl
      ? {
          imageUrl: user.contactInfo.imageUrl,
          isImagePublic: false,
          imageProvider: "aws",
        }
      : {
          imageUrl: user.image,
          isImagePublic: true,
          imageProvider: user.imageProvider as ImageProviderTypes,
        };

    return {
      chatName: getChatName(user),
      id: user.id,
      ...image,
    };
  }

  return {
    chatName: chat.name,
    id: chat.id,
    imageUrl: chat.imageUrl,
    isImagePublic: false,
    imageProvider: "aws",
  };
}

export function getChatName(user: UserWithContactType) {
  const chatName = user.contactInfo?.name
    ? user.contactInfo.name + " " + (user.contactInfo.lastName ?? "")
    : user.name + " " + (user.lastName ?? "");
  return chatName;
}

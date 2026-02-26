import { ConctactInfo, HomeChatsPrivateType, HomeChatsType, UserWithContactType } from "@/providers/types/user-store-provider-types";
import { FindHomeChatsReturnType } from "../db/findHomeChatsForStore";

export function mapChatsToStore(chatInfo: FindHomeChatsReturnType[]): {mappedUsers: Map<string, UserWithContactType>, mappedChatInfo: Map<string, HomeChatsType>} {
  const mappedChatInfo = new Map<string, HomeChatsType>();
  const mappedUsers = new Map<string, UserWithContactType>();

  for (let i = 0; i < chatInfo.length; i++) {
    const row = chatInfo[i];
    const contact = row.contactInfo;
    const baseUser = row.baseChatter;

    if (row.type === "group") {
      const refinedGroupChat: HomeChatsType = {
        id: row.id,
        imageUrl: row.imageUrl,
        name: row.name ?? "Group chat",
        type: "group",
        lastMessage:
          typeof row.lastMessage?.text === "undefined"
            ? null
            : {
                text: row.lastMessage.text ?? "No messages yet",
                updatedAt: row.lastMessage.updatedAt,
              },
      };
      mappedChatInfo.set(row.id, refinedGroupChat);
    } else {
      // TODO: Figure out what to do if the user id is null (it's possible that the user can be deleted)
      if (baseUser == null) {
        mappedChatInfo.set(row.id, {
          id: row.id,
          type: "private",
          userId: null,
          lastMessage: row.lastMessage?.text
            ? {
                text: row.lastMessage.text,
                updatedAt: row.lastMessage.updatedAt,
              }
            : null,
        });
        continue
      }
      const info: Pick<UserWithContactType, "name" | "lastName">= contact?.name
        ? { name: contact.name, lastName: contact.lastName }
        : { name: baseUser.name, lastName: baseUser.lastName };

      const images: Pick<UserWithContactType, "imageProvider" | "image"> = contact?.imageUrl
        ? { image: contact.imageUrl, imageProvider: "aws" }
        : { image: baseUser.image, imageProvider: baseUser.imageProvider };

      const contactInfo: ConctactInfo = {
        contactInfo: contact?.id ? {id: contact.id, imageUrl: contact.imageUrl, notes: contact.notes} : null
      }

      mappedUsers.set(baseUser.id, {
        createdAt: baseUser.createdAt,
        email: baseUser.email,
        id: baseUser.id,
        emailVerified: baseUser.emailVerified,
        username: baseUser.username,
        updatedAt: baseUser.updatedAt,
        bio: baseUser.bio,
        ...contactInfo,
        ...info,
        ...images,
      });

      const refinedPrivateChat: HomeChatsPrivateType = {
        id: row.id,
        lastMessage:
          typeof row.lastMessage?.text === "undefined"
            ? null
            : {
                text: row.lastMessage.text ?? "No messages yet",
                updatedAt: row.lastMessage.updatedAt,
              },
        type: "private",
        userId: baseUser?.id,
      };
      mappedChatInfo.set(row.id, refinedPrivateChat);
    }
  }

  return { mappedChatInfo, mappedUsers };
}


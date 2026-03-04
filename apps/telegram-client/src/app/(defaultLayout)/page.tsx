import { chats, contact, user } from "db";

export default async function Home() {
  return <div className="w-full h-screen"></div>;
}

type testInput = {
  id: string;
  type: "private" | "group";
  name: string | null;
  imageUrl: string | null;
  baseChatter: typeof user.$inferSelect | null;
  contactInfo: {
    contactId: string;
    imageUrl: string | null;
    name: string | null;
    lastName: string | null;
    notes: string | null;
  } | null;
  lastMessage: {
    text: string | null;
    updatedAt: Date;
  } | null;
};

type HomeChatsLastMessageType = {
  text: string;
  updatedAt: Date;
};

type HomeChatsPrivateType = {
  id: string;
  userId: string | null; // it's possible that the user deleted their account, then we want to show blank user and the chat with messages
  type: "private";
  lastMessage: HomeChatsLastMessageType | null;
};

type HomeChatsGroupType = {
  id: string;
  type: "group";
  name: string;
  imageUrl: string | null;
  lastMessage: HomeChatsLastMessageType | null;
};

type HomeChatsType = HomeChatsGroupType | HomeChatsPrivateType;
type User = typeof user.$inferSelect;

export function mapChatsToStoreBetter(chatInfo: testInput[]) {
  const mappedChatInfo = new Map<string, HomeChatsType>();
  const mappedUsers = new Map<string, User>();

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
        return;
      }
      const info = contact?.name
        ? { name: contact.name, lastName: contact.lastName }
        : { name: baseUser.name, lastName: baseUser.lastName };

      const images: Pick<User, "imageProvider" | "image"> = contact?.imageUrl
        ? { image: contact.imageUrl, imageProvider: "aws" }
        : { image: baseUser.image, imageProvider: baseUser.imageProvider };

      mappedUsers.set(baseUser.id, {
        bio: baseUser.bio,
        createdAt: baseUser.createdAt,
        email: baseUser.email,
        id: baseUser.id,
        emailVerified: baseUser.emailVerified,
        username: baseUser.username,
        updatedAt: baseUser.updatedAt,
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

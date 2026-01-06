import { contact } from "db";

type HomeChatsPrivateType = {
  id: string;
  type: "private";
  name: string;
  imageUrl: string | null;
  lastMessage: HomeChatsLastMessageType | null;
  username: string;
};

type HomeChatsGroupType = {
  id: string;
  type: "group";
  name: string;
  imageUrl: string | null;
  lastMessage: HomeChatsLastMessageType | null;
};

export type HomeChatsType = HomeChatsPrivateType | HomeChatsGroupType;

type HomeChatsLastMessageType = {
  text: string;
  updatedAt: Date;
};

type BaseContactType = Pick<
  typeof contact.$inferSelect,
  "imageUrl" | "lastName" | "notes" | "name"
>;

export type ContactType = BaseContactType & {
  userId: string;
  isContact: boolean;
  bio: string | null;
  username: string
};

type transformObjectType = {
  id: string;
  type: "private" | "group";
  name: string | null;
  imageUrl: string | null;
  baseChatter: {
    id: string;
    name: string;
    username: string;
    imageUrl: string | null;
    bio: string | null;
    lastNmae: string | null;
  } | null;
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

export default function mapChatsToStore(chatInfo: transformObjectType[]) {
  const mappedChatInfo = new Map<string, HomeChatsType>();
  const mappedContacts = new Map<string, ContactType>();

  for (let i = 0; i < chatInfo.length; i++) {
    const row = chatInfo[i];
    const contact = row.contactInfo;
    const baseUser = row.baseChatter;

    if (row.type === "group") {
      const refinedGroupChat: HomeChatsGroupType = {
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
      if (contact) {
        mappedContacts.set(baseUser!.username, {
          bio: baseUser!.bio,
          imageUrl: contact.imageUrl,
          isContact: true,
          lastName: contact.lastName,
          name: contact.name,
          notes: contact.notes,
          userId: contact.contactId,
          username: baseUser!.username
        });
      } else if (!contact && baseUser) {
        mappedContacts.set(baseUser.username, {
          bio: baseUser.bio,
          imageUrl: baseUser.imageUrl,
          isContact: false,
          lastName: baseUser.lastNmae,
          name: baseUser.name,
          notes: null,
          userId: baseUser.id,
          username: baseUser.username
        });
      }

      const refinedPrivateChat: HomeChatsPrivateType = {
        id: row.id,
        imageUrl: contact?.imageUrl ? contact.imageUrl : baseUser?.imageUrl ? baseUser.imageUrl : row.imageUrl,
        lastMessage:
          typeof row.lastMessage?.text === "undefined"
            ? null
            : {
                text: row.lastMessage.text ?? "No messages yet",
                updatedAt: row.lastMessage.updatedAt,
              },
        name: row.contactInfo?.name
          ? row.contactInfo.name
          : row.baseChatter!.name,
        type: "private",
        username: row.baseChatter!.username,
      };

      mappedChatInfo.set(row.id, refinedPrivateChat);
    }
  }

  return { mappedChatInfo, mappedContacts };
}


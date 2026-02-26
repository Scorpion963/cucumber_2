import { contact, user } from "db";

export type HomeChatsLastMessageType = {
  text: string;
  updatedAt: Date;
};

export type HomeChatsPrivateType = {
  id: string;
  userId: string | null; // it's possible that the user deleted their account, then we want to show blank user and the chat with messages
  type: "private";
  lastMessage: HomeChatsLastMessageType | null;
};

export type HomeChatsGroupType = {
  id: string;
  type: "group";
  name: string;
  imageUrl: string | null;
  lastMessage: HomeChatsLastMessageType | null;
};

export type HomeChatsType = HomeChatsGroupType | HomeChatsPrivateType;
export type ConctactInfo = {
    contactInfo: Pick<typeof contact.$inferSelect, "notes" | "id" | "imageUrl"> | null
}
export type UserWithContactType = typeof user.$inferSelect & ConctactInfo; 
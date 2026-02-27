import { ConctactInfo, UserWithContactType } from "@/providers/types/user-store-provider-types";
import { user } from "db";
import { BasicContact } from "../db/findHomeChatsForStore";

export default function createUserWithContact(baseUser: typeof user.$inferSelect, contact: BasicContact | null): UserWithContactType {
  const info: Pick<UserWithContactType, "name" | "lastName"> = contact?.name
    ? { name: contact.name, lastName: contact.lastName }
    : { name: baseUser.name, lastName: baseUser.lastName };

  const images: Pick<UserWithContactType, "imageProvider" | "image"> =
    contact?.imageUrl
      ? { image: contact.imageUrl, imageProvider: "aws" }
      : { image: baseUser.image, imageProvider: baseUser.imageProvider };

  const contactInfo: ConctactInfo = {
    contactInfo: contact?.id
      ? { id: contact.id, imageUrl: contact.imageUrl, notes: contact.notes }
      : null,
  };
  return {
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
  };
}

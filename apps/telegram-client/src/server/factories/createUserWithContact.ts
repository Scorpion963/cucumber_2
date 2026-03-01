import { ConctactInfo, UserWithContactType } from "@/providers/types/user-store-provider-types";
import { contact, user } from "db";

export default function createUserWithContact(baseUser: typeof user.$inferSelect, contactData: typeof contact.$inferSelect | null): UserWithContactType {
  const images: Pick<UserWithContactType, "imageProvider" | "image"> =
    contactData?.imageUrl
      ? { image: contactData.imageUrl, imageProvider: "aws" }
      : { image: baseUser.image, imageProvider: baseUser.imageProvider };

  const contactInfo: ConctactInfo = {
    contactInfo: contactData?.id
      ? { id: contactData.id, imageUrl: contactData.imageUrl, notes: contactData.notes, contactId: contactData.contactId, createdAt: contactData.createdAt, lastName: contactData.lastName, name: contactData.name}
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
    lastName: baseUser.lastName,
    name: baseUser.name,
    ...contactInfo,
    ...images,
  };
}

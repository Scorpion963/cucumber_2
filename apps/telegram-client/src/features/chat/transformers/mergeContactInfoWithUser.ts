import { contact, user } from "db";

type UserType = typeof user.$inferSelect;
type ContactType = typeof contact.$inferSelect;
type UserWithContactsOf = UserType & { contactsOf: ContactType[] };

export default function mergeContactInfoWithUser(user: UserWithContactsOf) {
  const firstContact = user.contactsOf[0];

  return {
    ...user,
    image: firstContact?.imageUrl ?? user.image,
    name: firstContact?.name ?? user.name,
  };
}


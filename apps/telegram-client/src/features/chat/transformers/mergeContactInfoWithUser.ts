import { contact, user } from "db";

type UserType = typeof user.$inferSelect;
type ContactType = typeof contact.$inferSelect;
type UserWithContactsOf = UserType & { contactsOf: ContactType[] };

export default function mergeContactInfoWithUser(user: UserWithContactsOf) {
  return {
    ...user,
    image: user.contactsOf[0].imageUrl
      ? user.contactsOf[0].imageUrl
      : user.image,
    name: user.contactsOf[0].name ? user.contactsOf[0].name : user.name,
  };
}

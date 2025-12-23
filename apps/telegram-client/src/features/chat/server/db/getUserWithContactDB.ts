import { contact, db, user } from "db";
import { eq, ilike, or } from "drizzle-orm";

export default async function getUsersWithContactDB(
  username: string,
  userId: string
) {
  return db.query.user.findMany(baseUserWithContactQuery(username, userId));
}

export async function getUserWithContactSingle(
  username: string,
  userId: string
) {
  return db.query.user.findFirst(baseUserWithContactQuery(username, userId));
}

function baseUserWithContactQuery(username: string, userId: string) {
  return {
    where: or(
      ilike(user.username, `%${username}%`),
      ilike(user.name, `${username}`)
    ),
    with: {
      contactsOf: {
        where: eq(contact.ownerId, userId),
        limit: 1,
      },
    },
  };
}

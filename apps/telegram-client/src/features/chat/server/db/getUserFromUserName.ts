import { db, user } from "db";
import { eq } from "drizzle-orm";

export default async function getUserFromUserName(username: string) {
  return await db.query.user.findFirst({
    where: eq(user.username, username),
  });
}

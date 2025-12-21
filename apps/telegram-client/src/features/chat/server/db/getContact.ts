import { contact, db } from "db";
import { and, eq } from "drizzle-orm";

export default function getContact(chatterId: string, currentUserId: string) {
  return db.query.contact.findFirst({
    where: and(
      eq(contact.ownerId, currentUserId),
      eq(contact.contactId, chatterId)
    ),
  });
}

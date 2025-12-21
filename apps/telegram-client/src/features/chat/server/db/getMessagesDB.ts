import { db, message } from "db";
import { eq } from "drizzle-orm";

export default function getMessagesDB(chatId: string) {
  return db.query.message.findMany({
    where: eq(message.id, chatId),
  });
}

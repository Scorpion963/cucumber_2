import { db, message } from "db";
import { asc, eq } from "drizzle-orm";

export default function getMessagesDB(chatId: string) {
  return db.query.message.findMany({
    where: eq(message.chatId, chatId),
    orderBy: asc(message.createdAt)
  });
}

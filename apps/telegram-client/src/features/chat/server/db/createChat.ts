import { chatMember, chats, db } from "db";

export default async function createChat(firstUserId: string, secondUserId: string) {
  return db.transaction(async (ctx) => {
    const [chat] = await ctx
      .insert(chats)
      .values({ type: "private" })
      .returning({ id: chats.id });

    const chatMembers = await ctx
      .insert(chatMember)
      .values([
        { chatId: chat.id, userId: firstUserId },
        { chatId: chat.id, userId: secondUserId },
      ])
      .returning();
  });
}
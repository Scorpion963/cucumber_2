import SearchContacts from "./components/SearchContacts";
import ContactList from "./components/ContactList";
import { chatMember, db } from "db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { SearchStoreProvider } from "./providers/search-store-provider";

export default async function Sidebar() {
  const data = await auth.api.getSession({ headers: await headers() });
  const chats = await db.query.chatMember.findMany({
    where: eq(chatMember.userId, data!.user.id),
  });
  console.log("chats: ", chats);

  return (
    <SearchStoreProvider>
      <div className="flex flex-col h-full">
        <SearchContacts />
        <ContactList />
      </div>
    </SearchStoreProvider>
  );
}

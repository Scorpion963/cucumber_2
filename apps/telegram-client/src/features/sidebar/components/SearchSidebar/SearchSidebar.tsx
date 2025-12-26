import { auth } from "@/lib/auth";
import ContactList from "./ContactList";
import SearchContacts from "./SearchContacts";
import UserMenu from "./UserMenu";
import { SearchStoreProvider } from "../../providers/search-store-provider";
import { headers } from "next/headers";
import { chatMember, db } from "db";
import { eq } from "drizzle-orm";

export default async function SearchSidebar() {
  const data = await auth.api.getSession({ headers: await headers() });
  const chats = await db.query.chatMember.findMany({
    where: eq(chatMember.userId, data!.user.id),
  });
  console.log("chats: ", chats);

  return (
    <SearchStoreProvider>
      <div className="flex flex-col h-full">
        <div className="flex  items-center gap-4 px-4">
          <UserMenu />
          <SearchContacts />
        </div>
        <ContactList />
      </div>
    </SearchStoreProvider>
  );
}

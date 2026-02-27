import ContactList from "./components/ContactList";
import SearchContacts from "./components/SearchContacts";
import UserMenu from "./components/UserMenu";
import { SearchStoreProvider } from "./providers/search-store-provider";

export default async function SearchSidebar() {
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

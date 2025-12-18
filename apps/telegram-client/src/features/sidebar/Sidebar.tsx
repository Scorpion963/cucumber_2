import SearchContacts from "./components/SearchContacts";
import ContactList from "./components/ContactList";

export default async function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <SearchContacts />
      <ContactList />
    </div>
  );
}

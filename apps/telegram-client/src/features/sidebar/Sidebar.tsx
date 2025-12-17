import { ScrollArea } from "@/components/ui/scroll-area";
import SearchContacts from "./components/SearchContacts";

export default async function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <SearchContacts />
      <ScrollArea className="h-full w-full overflow-hidden"></ScrollArea>
    </div>
  );
}

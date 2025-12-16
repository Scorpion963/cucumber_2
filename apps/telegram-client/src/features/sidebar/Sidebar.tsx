import { ScrollArea } from "@/components/ui/scroll-area";
import Contact from "./components/Contact";
import Search from "@/components/Search";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <Search />
      <ScrollArea className="h-full w-full overflow-hidden">
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
      </ScrollArea>
    </div>
  );
}

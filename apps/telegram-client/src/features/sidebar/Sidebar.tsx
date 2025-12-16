import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoIosSearch } from "react-icons/io";
import Contact from "./components/Contact";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex w-full relative items-center justify-between py-2">
        <IoIosSearch size={20} className="absolute left-3" />
        <Input className="rounded-full pl-10" />
      </div>
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

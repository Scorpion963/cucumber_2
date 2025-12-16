import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";

export default function Sidebar() {
  return (
    <div className="p-1 flex flex-col h-full">
      <div className="flex w-full relative items-center justify-between">
        <IoIosSearch size={20} className="absolute left-3" />
        <Input className="rounded-full pl-10" />
      </div>
      <div className="h-full ">
        <ScrollArea className="h-full">
          <Contact />
          <Contact />
          <Contact />
          <Contact />
        </ScrollArea>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <Link href={'/'} className="w-full rounded-lg flex justify-between items-center hover:bg-card/90 p-3">
      <div className="flex items-center gap-2">
        <div className="size-13  rounded-full bg-gray-500"></div>
        <div>
          <div className="font-semibold">Name</div>
          <div className="text-sm text-muted-foreground">This is my last message</div>
        </div>
      </div>

      <div className="self-start text-muted-foreground text-xs">21:00</div>
    </Link>
  );
}

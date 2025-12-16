import Link from "next/link";

export default function Contact() {
  return (
    <Link
      href={"/"}
      className="w-full rounded-lg flex justify-between items-center hover:bg-card/90 p-3 transition-colors duration-300 @container"
    >
      <div className="flex items-center gap-2 flex-initial overflow-hidden">
        <div className="size-10 flex-none rounded-full bg-gray-500"></div>
        <div className="min-w-0">
          <div className="font-semibold text-sm">Name</div>
          <div className="text-sm text-muted-foreground truncate w-[95%] inline-block whitespace-nowrap overflow-hidden">
            This is my last message This is my last message This is my last
            message This is my last message
          </div>
        </div>
      </div>
      <div className="self-start text-muted-foreground text-xs">21:00</div>
    </Link>
  );
}

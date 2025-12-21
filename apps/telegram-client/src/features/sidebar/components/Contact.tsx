import Image from "next/image";
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";

export default function Contact({ imageUrl, name, id }: { imageUrl: string | null, name: string; id: string }) {
  return (
    <Link
      href={`/@${id}`}
      className="w-full rounded-lg flex justify-between items-center hover:bg-card/90 p-3 transition-colors duration-300 @container"
    >
      <div className="flex items-center gap-2 flex-initial overflow-hidden">
        <div className="size-10 flex-none rounded-full bg-card flex items-center justify-center relative overflow-hidden">
          {imageUrl ? <Image src={`${imageUrl}`} fill style={{objectFit: 'cover'}} alt={`${name}\'s photo`} /> : <FaUserAlt size={24} />}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm">{name}</div>
          <div className="text-sm text-muted-foreground truncate w-full max-w-[500px] inline-block whitespace-nowrap overflow-hidden">
            This is my last message This is my last message This is my last
            message This is my last message
          </div>
        </div>
      </div>
      <div className="self-start text-muted-foreground text-xs">21:00</div>
    </Link>
  );
}

"use client";
import { Phone } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { toast } from "sonner";

export default function UserInfo({
  email,
  username,
}: {
  email: string;
  username: string;
}) {
  async function copyText(text: string, message: string) {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(text);
      toast.info(message);
    } catch {
      toast.error("Error copying happened")
    }
  }
  return (
    <div className="w-full">
      <UserImage />

      <SidebarItem onClick={() => copyText(email, "Email was copied")} header={email} label="Email" icon={<Phone />} />
      <SidebarItem onClick={() => copyText(`@${username}`, "Username was copied")} header={`@${username}`} label="Username" icon={<Phone />} />
    </div>
  );
}

function UserImage() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="size-32 bg-gray-500 rounded-full"></div>
      <div>...</div>
      <div className="">online</div>
    </div>
  );
}

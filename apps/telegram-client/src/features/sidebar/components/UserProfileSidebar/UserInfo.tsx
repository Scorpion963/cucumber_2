"use client";
import { Phone } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { toast } from "sonner";
import { UserImage } from "@/components/UserImage";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { getPublicAssetUrl } from "@/services/s3/lib/helpers";

export default function UserInfo() {
  const {currentUser} = useCurrentUserStore(state => state)
  async function copyText(text: string, message: string) {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(text);
      toast.info(message);
    } catch {
      toast.error("Error copying happened");
    }
  }

  return (
    <div className="w-full">
      <UserImage imageUrl={getPublicAssetUrl(currentUser.image, currentUser.imageProvider)} name={currentUser.username} />

      <SidebarItem
        onClick={() => copyText(currentUser.email, "Email was copied")}
        header={currentUser.email}
        label="Email"
        icon={<Phone />}
      />
      <SidebarItem
        onClick={() => copyText(`@${currentUser.username}`, "Username was copied")}
        header={`@${currentUser.username}`}
        label="Username"
        icon={<Phone />}
      />
    </div>
  );
}

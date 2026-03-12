"use client";
import CustomizeUserForm from "./components/CustomizeUserForm";
import { ImageProviderTypes } from "db";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { getPublicAssetUrl } from "@/services/s3/lib/helpers";
import SidebarBackHeader from "@/components/SidebarRouter/components/SidebarBackHeader";

export default function CustomizeUserSidebar() {
  const { currentUser } = useCurrentUserStore((state) => state);

  return (
    <div className="pr-2">
      <SidebarBackHeader title="Edit profile" />
      <CustomizeUserForm
        defaultUserImage={{
          image: getPublicAssetUrl(currentUser.image, currentUser.imageProvider),
          imageProvider: currentUser.imageProvider as ImageProviderTypes,
        }}
        defaultFields={{
          bio: currentUser.bio ?? "",
          name: currentUser.name,
          lastName: currentUser.lastName ?? "",
          username: currentUser.username,
        }}
      />
    </div>
  );
}

"use client";
import SidebarHeader from "../components/SidebarHeader";
import CustomizeUserForm from "./components/CustomizeUserForm";
import { ImageProviderTypes } from "db";
import { useCurrentUserStore } from "@/providers/current-user-store-provider";
import { useEffect, useState } from "react";
import { getImageUrlS3 } from "@/actions/getSignedUrl";

export default function CustomizeUserSidebar() {
  const { currentUser } = useCurrentUserStore((state) => state);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    console.log("Current user: ", currentUser)
  }, [currentUser])

  console.log("image: ", image)
  useEffect(() => {
    async function s() {
      if (currentUser.image != null && currentUser.imageProvider === "aws") {
        setImage(await getImageUrlS3(currentUser.image));
      }else{
        setImage(currentUser.image)
      }
    }

    s()
  }, [currentUser.image, currentUser.imageProvider]);

  return (
    <div className="pr-2">
      <SidebarHeader title="Edit profile" />
      <CustomizeUserForm
        defaultUserImage={{
          image: image,
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


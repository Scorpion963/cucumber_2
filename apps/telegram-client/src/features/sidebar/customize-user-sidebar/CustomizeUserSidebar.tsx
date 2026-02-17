import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SidebarHeader from "../components/SidebarHeader";
import CustomizeUserForm from "./components/CustomizeUserForm";
import { ImageProviderTypes } from "db";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, s3 } from "@/services/s3/s3";

export default async function CustomizeUserSidebar() {
  const currentUser = await auth.api.getSession({ headers: await headers() });
  if (!currentUser) return <>You must be signed in</>;

  console.log("Current user: ", currentUser.user);

  const imageUrl =
    currentUser.user.image != null && currentUser.user.imageProvider === "aws"
      ? await getImageUrlS3(currentUser.user.image)
      : (currentUser.user.image ?? null);

      console.log("Image url", imageUrl)

  return (
    <div className="pr-2">
    
      <SidebarHeader title="Edit profile" />
      <CustomizeUserForm
        defaultUserImage={{
          image: imageUrl,
          imageProvider: currentUser.user.imageProvider as ImageProviderTypes,
        }}
        defaultFields={{
          bio: currentUser.user.bio ?? "",
          firstName: currentUser.user.name,
          lastName: currentUser.user.lastName ?? "",
          username: currentUser.user.username,
        }}
      />
    </div>
  );
}

// TODO: the presigned links should also be generated on the client in case the person hasn't reloaded the page
async function getImageUrlS3(key: string) {
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: 120 });
  return url;
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SidebarHeader from "../components/SidebarHeader";
import CustomizeUserForm from "./components/CustomizeUserForm";

export default async function CustomizeUserSidebar() {
  const currentUser = await auth.api.getSession({ headers: await headers() });
  if (!currentUser) return <>You must be signed in</>;

  console.log("Current user: ", currentUser.user)

  return (
    <div className="pr-2">
      <SidebarHeader title="Edit profile" />
      <CustomizeUserForm
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

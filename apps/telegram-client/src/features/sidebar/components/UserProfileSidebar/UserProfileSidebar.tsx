import { auth } from "@/lib/auth";
import { Settings } from "./Settings";
import UserInfo from "./UserInfo";
import { headers } from "next/headers";

export default async function UserProfileSidebar() {
  const session = await auth.api.getSession({headers: await headers()})
  return (
    <div className="flex flex-col h-full gap-4">
      <Settings />
      <UserInfo email={session!.user.email} username={session!.user.username} />
    </div>
  );
}

import { Settings } from "./Settings";
import UserInfo from "./UserInfo";

export default async function UserProfileSidebar() {
  return (
    <div className="flex flex-col h-full gap-4">
      <Settings />
      <UserInfo />
    </div>
  );
}

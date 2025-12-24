import { Phone } from "lucide-react";
import SidebarItem from "./SidebarItem";

export default function UserInfo() {
  return (
    <div className="w-full">
      <UserImage />
      <SidebarItem
        header="jackson20062008@gmail.com"
        label="Email"
        icon={<Phone />}
      />

      <SidebarItem header="@dimasik23123" label="Username" icon={<Phone />} />
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

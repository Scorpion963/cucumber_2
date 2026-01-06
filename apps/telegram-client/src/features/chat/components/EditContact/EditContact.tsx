"use client";
import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import { UserImage } from "@/components/UserImage";
import EditContactForm from "./EditContactForm";
import useChatInfo from "../../hooks/useChatInfo";

export default function EditContact() {
  const { chatter } = useChatInfo();

  return (
    <div className="h-full border-l w-106">
      <SidebarHeader className="" title="Edit" onClick={() => {}} />
      <div>
        <UserImage
          name={chatter?.name ?? "User"}
          imageUrl={chatter?.imageUrl}
        />
        <EditContactForm
          chatter={chatter!}
        />
      </div>
    </div>
  );
}

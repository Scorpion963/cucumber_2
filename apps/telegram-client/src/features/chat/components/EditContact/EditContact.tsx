import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import { UserImage } from "@/components/UserImage";
import UserInfo from "@/features/sidebar/components/UserProfileSidebar/UserInfo";
import EditContactForm from "./EditContactForm";

export default function EditContact() {
  return (
    <div className="h-full border-l w-106">
      <SidebarHeader className="" title="Edit" onClick={() => {}} />
      <div>
        <UserImage name="Egor" />
        <EditContactForm />
      </div>
    </div>
  );
}



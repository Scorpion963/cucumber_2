"use client";
import SidebarHeader from "@/components/Sidebar/SidebarHeader";
import { UserImage } from "@/components/UserImage";
import EditContactForm from "./EditContactForm";
import useChatInfo from "../../hooks/useChatInfo";
import { useSidebarRouterStore } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import { useEffect } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function EditContact() {
  const { pop } = useSidebarRouterStore((state) => state);
  const { chatImageUrl, chatName, chatter } = useChatInfo();
  const { matches, prev } = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (matches && matches !== prev) pop();
  }, [matches, prev, pop]);

  return (
    <div className="h-full border-l absolute z-50 inset-0 bg-background w-full lg:static lg:w-104">
      <SidebarHeader className="" title="Edit" onClick={() => pop()} />
      <div>
        <UserImage name={chatName} imageUrl={chatImageUrl} />
        {chatter && <EditContactForm chatter={chatter} />}
      </div>
    </div>
  );
}

import { SidebarRouterProvider } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import SidebarRouter from "@/components/SidebarRouter/SidebarRouter";
import SearchSidebar from "./SearchSidebar";
import UserProfileSidebar from "./UserProfileSidebar";


const routes = {
  "/main": <SearchSidebar />,
  "/user-profile": <UserProfileSidebar />
}

export default async function Sidebar() {
  return (
    <SidebarRouterProvider routes={["/main"]}>
      <SidebarRouter routesMap={routes} />
    </SidebarRouterProvider>
  );
}



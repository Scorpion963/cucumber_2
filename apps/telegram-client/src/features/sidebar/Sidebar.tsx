import { SidebarRouterProvider } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import SidebarRouter from "@/components/SidebarRouter/SidebarRouter";
import SearchSidebar from "./search-sidebar/SearchSidebar";
import UserProfileSidebar from "./components/UserProfileSidebar/UserProfileSidebar";
import CustomizeUserSidebar from "./customize-user-sidebar/CustomizeUserSidebar";

const routes = {
  "/main": <SearchSidebar />,
  "/user-profile": <UserProfileSidebar />,
  "/customize-user": <CustomizeUserSidebar />,
};

export default async function Sidebar() {
  return (
    <SidebarRouterProvider routes={["/main"]}>
      <SidebarRouter routesMap={routes} />
    </SidebarRouterProvider>
  );
}

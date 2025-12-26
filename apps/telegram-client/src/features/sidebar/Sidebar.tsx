import { SidebarRouterProvider } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import SidebarRouter from "@/components/SidebarRouter/SidebarRouter";
import SearchSidebar from "./components/SearchSidebar/SearchSidebar";
import UserProfileSidebar from "./components/UserProfileSidebar/UserProfileSidebar";
import CustomizeUserSidebar from "./components/CustomizeUserSidebar/CustomizeUserSidebar";

const routes = {
  "/main": <SearchSidebar />,
  "/user-profile": <UserProfileSidebar />,
  "/customize-user": <CustomizeUserSidebar />,
};

export default async function Sidebar() {
  return (
    <SidebarRouterProvider routes={["/customize-user"]}>
      <SidebarRouter routesMap={routes} />
    </SidebarRouterProvider>
  );
}

import { SidebarRouterProvider } from "@/components/SidebarRouter/providers/sidebar-routes-provider";
import SidebarRouter from "@/components/SidebarRouter/SidebarRouter";
import SearchSidebar from "./search-sidebar/SearchSidebar";
import UserProfileSidebar from "./components/UserProfileSidebar/UserProfileSidebar";
import CustomizeUserSidebar from "./customize-user-sidebar/CustomizeUserSidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  CurrentUserStoreProvider,
} from "@/providers/current-user-store-provider";
import { db, ImageProviderTypes, user } from "db";

const routes = {
  "/main": <SearchSidebar />,
  "/user-profile": <UserProfileSidebar />,
  "/customize-user": <CustomizeUserSidebar />,
};

export default async function Sidebar() {
  const currentUser = await auth.api.getSession({ headers: await headers() });
  if (!currentUser?.user) return;

  // I can't match the types that are in drizzle and better auth, they are slightly out of sync, because unprovided types 
  // in drizzle are null by default, but better auth doesn't know that, so it assins them possible undefined which breaks the ts
  
  const typedU = currentUser.user as typeof user.$inferSelect

  return (
    <CurrentUserStoreProvider
      currentUser={{
        ...typedU,
      }}
    >
      <SidebarRouterProvider routes={["/main"]}>
        <SidebarRouter routesMap={routes} />
      </SidebarRouterProvider>
    </CurrentUserStoreProvider>
  );
}

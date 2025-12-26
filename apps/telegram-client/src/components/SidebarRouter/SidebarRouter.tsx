"use client";
import { ReactNode } from "react";
import { useSidebarRouterStore } from "./providers/sidebar-routes-provider";
import { AnimatePresence } from "framer-motion";
import SidebarAnimationWrapper from "@/features/sidebar/components/SidebarAnimationWrapper";

export default function SidebarRouter({
  routesMap,
}: {
  routesMap: Record<string, ReactNode>;
}) {
  const { routes, previousRoutes } = useSidebarRouterStore((state) => state);
  const activeRoute = routes[routes.length - 1];

  console.log("previousRoutes: ", previousRoutes)
  console.log("Current: ", routes)

  return (
    <div className="relative">
      <AnimatePresence mode="sync">
        <SidebarAnimationWrapper isBack={previousRoutes.length > routes.length} key={activeRoute}>
          {routesMap[activeRoute] ?? <div>Route was not found</div>}
        </SidebarAnimationWrapper>
      </AnimatePresence>
    </div>
  );
}

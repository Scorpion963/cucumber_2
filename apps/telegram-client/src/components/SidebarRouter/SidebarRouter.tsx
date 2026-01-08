"use client";
import { ReactNode } from "react";
import { useSidebarRouterStore } from "./providers/sidebar-routes-provider";
import { AnimatePresence } from "framer-motion";
import SidebarAnimationWrapper from "@/features/sidebar/components/SidebarAnimationWrapper";

export default function SidebarRouter({
  routesMap,
  animate = true,
}: {
  routesMap: Record<string, ReactNode>;
  animate?: boolean;
}) {
  const { routes, previousRoutes } = useSidebarRouterStore((state) => state);
  const activeRoute = routes[routes.length - 1];

  console.log("previousRoutes: ", previousRoutes);
  console.log("Current: ", routes);

  console.log("Route: ", routesMap[activeRoute]);

  if (!animate) {
    return routesMap[activeRoute] ?? <></>;
  }

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="sync">
        <SidebarAnimationWrapper
          isBack={previousRoutes.length > routes.length}
          key={activeRoute}
        >
          {routesMap[activeRoute] ?? <></>}
        </SidebarAnimationWrapper>
      </AnimatePresence>
    </div>
  );
}

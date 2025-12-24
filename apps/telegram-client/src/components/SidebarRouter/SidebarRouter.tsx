"use client";
import { ReactNode } from "react";
import { useSidebarRouterStore } from "./providers/sidebar-routes-provider";


export default function SidebarRouter({routesMap}: {routesMap: Record<string, ReactNode>}) {
  const { routes } = useSidebarRouterStore((state) => state);
  const activeRoute = routes[routes.length - 1]
  
  return routesMap[activeRoute] ?? <div>Route was not found</div>;
}
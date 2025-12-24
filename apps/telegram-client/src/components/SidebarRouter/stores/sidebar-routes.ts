import { createStore } from "zustand/vanilla";
import { produce } from "immer";

export type SidebarRouterState = {
  routes: string[];
};

export type SidebarRouterActions = {
  push: (route: string) => void;
  pop: () => string | null;
};

export type SidebarRouterStore = SidebarRouterState & SidebarRouterActions;

export const SidebarInitState = {
  routes: [],
};

export function createSidebarRouterStore(
  initState: SidebarRouterState = SidebarInitState
) {
  return createStore<SidebarRouterStore>()((set, get) => ({
    ...initState,
    pop: () => {
      const routes = get().routes;
      const last = routes[routes.length - 1];
      if (routes.length === 0) return null;

      set(
        produce((state: SidebarRouterState) => {
          state.routes.pop();
        })
      );
      return last;
    },
    push: (route) => {
      set(
        produce((state: SidebarRouterState) => {
          state.routes.push(route);
        })
      );
    },
  }));
}

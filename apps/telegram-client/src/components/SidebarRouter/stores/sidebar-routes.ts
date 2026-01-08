import { createStore } from "zustand/vanilla";
import { produce } from "immer";

export type SidebarRouterState = {
  routes: string[];
  previousRoutes: string[];
};

export type SidebarRouterActions = {
  push: (route: string) => void;
  pop: () => string | null;
  replace: (route: string) => void;
};

export type SidebarRouterStore = SidebarRouterState & SidebarRouterActions;

export const SidebarInitState = {
  routes: [],
  previousRoutes: [],
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
          state.previousRoutes = [...state.routes];
          state.routes.pop();
        })
      );
      return last;
    },

    push: (route) => {
      set(
        produce((state: SidebarRouterState) => {
          state.previousRoutes = [...state.routes];
          state.routes.push(route);
        })
      );
    },

    replace: (route) => {
      set(
        produce((state: SidebarRouterState) => {
          state.previousRoutes = [...state.routes];
          if (state.routes.length === 0) {
            state.routes.push(route);
          } else {
            state.routes[state.routes.length - 1] = route;
          }
        })
      );
    },
  }));
}

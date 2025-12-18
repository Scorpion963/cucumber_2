import { user } from "db";
import { createStore } from "zustand/vanilla";

export type UserState = {
  users: (typeof user.$inferSelect)[];
};

export type UserActions = {
  setUsers: (usersToBeAdded: (typeof user.$inferSelect)[]) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = { users: [] };

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setUsers: (usersToBeAdded) => set(() => ({ users: usersToBeAdded })),
  }));
};
